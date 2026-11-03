import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthenticatedUser, JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 12;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  // ---------------------------------------------------------------------------
  // Helper: SHA-256 Cryptographic Hash for Tokens (never store raw tokens in DB)
  // ---------------------------------------------------------------------------
  private hashToken(rawToken: string): string {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }

  // ---------------------------------------------------------------------------
  // Helper: Sanitize User entity
  // ---------------------------------------------------------------------------
  private sanitizeUser(user: any): AuthenticatedUser {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
    };
  }

  // ---------------------------------------------------------------------------
  // 1. REGISTRATION
  // ---------------------------------------------------------------------------
  async register(dto: RegisterDto): Promise<{ message: string; user: AuthenticatedUser }> {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check username availability
    const existingUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username is already taken by another contender');
    }

    // Check email uniqueness
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new ConflictException('An account with this email address already exists');
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);

    try {
      // Transaction: create User and PlayerProfile together
      const user = await this.prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            username: dto.username,
            email: dto.email,
            passwordHash,
            role: 'USER',
            emailVerified: false,
          },
        });

        // Initialize Arcadia player progression profile
        await tx.playerProfile.create({
          data: {
            userId: newUser.id,
            rank: 'ROOKIE',
            level: 1,
            xp: 0,
            title: 'Wanderer of Arcadia',
            reputationScore: 100,
            duelsWon: 0,
            matchesPlayed: 0,
          },
        });

        return newUser;
      });

      // Generate verification token (32 bytes raw)
      const rawVerificationToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = this.hashToken(rawVerificationToken);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await this.prisma.emailVerificationToken.create({
        data: {
          hashedToken,
          email: user.email,
          userId: user.id,
          expiresAt,
        },
      });

      // Dispatch verification email (or log safely in dev)
      await this.mailService.sendVerificationEmail(user.email, rawVerificationToken, user.username);

      return {
        message: 'Account successfully registered. Please verify your email address to unlock full features.',
        user: this.sanitizeUser(user),
      };
    } catch (error) {
      this.logger.error(`Registration error for ${dto.email}: ${(error as Error).message}`);
      throw new InternalServerErrorException('Failed to complete registration sequence');
    }
  }

  // ---------------------------------------------------------------------------
  // 2. LOGIN (Email & Password)
  // ---------------------------------------------------------------------------
  async login(
    dto: LoginDto,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    user: AuthenticatedUser;
    profile: any;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { playerProfile: true },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password credentials');
    }

    // Issue tokens & session
    const tokens = await this.createTokensAndSession(user, userAgent, ipAddress);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: this.sanitizeUser(user),
      profile: user.playerProfile,
    };
  }

  // ---------------------------------------------------------------------------
  // 3. REFRESH TOKEN ROTATION & REUSE DETECTION
  // ---------------------------------------------------------------------------
  async refreshTokens(
    rawRefreshToken: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: AuthenticatedUser }> {
    if (!rawRefreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    const hashedToken = this.hashToken(rawRefreshToken);
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { hashedToken },
      include: { user: true },
    });

    // Token reuse detection:
    // If token not found or already revoked, an adversary may have stolen or reused an old token.
    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (tokenRecord.revoked) {
      this.logger.warn(
        `[SECURITY ALERT] Refresh token reuse detected for user ${tokenRecord.userId}! Revoking token family: ${tokenRecord.family}`,
      );
      // Revoke all tokens belonging to this compromised token family
      await this.prisma.refreshToken.updateMany({
        where: { family: tokenRecord.family },
        data: { revoked: true },
      });
      // Invalidate active sessions
      await this.prisma.session.deleteMany({
        where: { userId: tokenRecord.userId },
      });
      throw new UnauthorizedException(
        'Compromised session sequence detected. All sessions have been revoked for your security. Please log in again.',
      );
    }

    // Expiration check
    if (tokenRecord.expiresAt < new Date()) {
      await this.prisma.refreshToken.update({
        where: { id: tokenRecord.id },
        data: { revoked: true },
      });
      throw new UnauthorizedException('Refresh token has expired. Please log in again.');
    }

    // Revoke the current refresh token (one-time use rotation)
    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revoked: true },
    });

    // Generate new access token
    const newAccessToken = this.generateAccessToken(tokenRecord.user);

    // Generate new refresh token within the same token family
    const newRawRefreshToken = crypto.randomBytes(40).toString('hex');
    const newHashedToken = this.hashToken(newRawRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        hashedToken: newHashedToken,
        userId: tokenRecord.userId,
        family: tokenRecord.family,
        revoked: false,
        expiresAt,
      },
    });

    // Update active session metadata
    if (userAgent || ipAddress) {
      await this.prisma.session.create({
        data: {
          sessionToken: crypto.randomUUID(),
          userId: tokenRecord.userId,
          userAgent,
          ipAddress,
          expiresAt,
        },
      });
    }

    return {
      accessToken: newAccessToken,
      refreshToken: newRawRefreshToken,
      user: this.sanitizeUser(tokenRecord.user),
    };
  }

  // ---------------------------------------------------------------------------
  // 4. LOGOUT (Revoke Refresh Token & Remove Session)
  // ---------------------------------------------------------------------------
  async logout(rawRefreshToken?: string, userId?: string): Promise<{ message: string }> {
    if (rawRefreshToken) {
      const hashedToken = this.hashToken(rawRefreshToken);
      const token = await this.prisma.refreshToken.findUnique({
        where: { hashedToken },
      });
      if (token) {
        await this.prisma.refreshToken.updateMany({
          where: { family: token.family },
          data: { revoked: true },
        });
      }
    }

    if (userId) {
      await this.prisma.session.deleteMany({
        where: { userId },
      });
    }

    return { message: 'Logged out successfully' };
  }

  // ---------------------------------------------------------------------------
  // 5. EMAIL VERIFICATION
  // ---------------------------------------------------------------------------
  async verifyEmail(rawToken: string): Promise<{ message: string }> {
    if (!rawToken) {
      throw new BadRequestException('Verification token is required');
    }

    const hashedToken = this.hashToken(rawToken);
    const tokenRecord = await this.prisma.emailVerificationToken.findUnique({
      where: { hashedToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    if (tokenRecord.expiresAt < new Date()) {
      await this.prisma.emailVerificationToken.delete({ where: { id: tokenRecord.id } });
      throw new BadRequestException('Verification token has expired. Please request a new link.');
    }

    // Mark email as verified
    await this.prisma.user.update({
      where: { email: tokenRecord.email },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    // Delete used token
    await this.prisma.emailVerificationToken.delete({ where: { id: tokenRecord.id } });

    return { message: 'Contender email address has been successfully verified' };
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Protect against account enumeration: return uniform success message
    if (!user) {
      return { message: 'If this email belongs to a contender account, a verification link has been dispatched.' };
    }

    if (user.emailVerified) {
      return { message: 'This email address is already verified.' };
    }

    // Clear old tokens for this email
    await this.prisma.emailVerificationToken.deleteMany({ where: { email } });

    // Generate new token
    const rawVerificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = this.hashToken(rawVerificationToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.prisma.emailVerificationToken.create({
      data: {
        hashedToken,
        email: user.email,
        userId: user.id,
        expiresAt,
      },
    });

    await this.mailService.sendVerificationEmail(user.email, rawVerificationToken, user.username);

    return { message: 'If this email belongs to a contender account, a verification link has been dispatched.' };
  }

  // ---------------------------------------------------------------------------
  // 6. PASSWORD RECOVERY (Forgot / Reset)
  // ---------------------------------------------------------------------------
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Critical security: Never reveal if an email exists
    if (!user) {
      return { message: 'If an account exists for this email, password reset instructions have been sent.' };
    }

    // Invalidate existing unused tokens for this user
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate 32-byte raw token and store hash
    const rawResetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = this.hashToken(rawResetToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.passwordResetToken.create({
      data: {
        hashedToken,
        userId: user.id,
        expiresAt,
        used: false,
      },
    });

    await this.mailService.sendPasswordResetEmail(user.email, rawResetToken);

    return { message: 'If an account exists for this email, password reset instructions have been sent.' };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('New password and confirmation do not match');
    }

    const hashedToken = this.hashToken(dto.token);
    const tokenRecord = await this.prisma.passwordResetToken.findUnique({
      where: { hashedToken },
    });

    if (!tokenRecord || tokenRecord.used) {
      throw new BadRequestException('Password reset token is invalid or has already been used');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new BadRequestException('Password reset token has expired. Please initiate a new request.');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(dto.newPassword, this.saltRounds);

    // Update password & mark token as used
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: tokenRecord.userId },
        data: { passwordHash },
      });

      await tx.passwordResetToken.update({
        where: { id: tokenRecord.id },
        data: { used: true },
      });

      // Session revocation after password reset: Invalidate ALL refresh tokens & sessions
      await tx.refreshToken.updateMany({
        where: { userId: tokenRecord.userId },
        data: { revoked: true },
      });

      await tx.session.deleteMany({
        where: { userId: tokenRecord.userId },
      });
    });

    return {
      message: 'Password successfully updated. All active sessions have been revoked. Please log in with your new credentials.',
    };
  }

  // ---------------------------------------------------------------------------
  // 7. GOOGLE OAUTH 2.0 / ACCOUNT LINKING
  // ---------------------------------------------------------------------------
  async handleGoogleAuth(
    googleUser: any,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: AuthenticatedUser }> {
    const { providerAccountId, email, displayName, avatar, accessToken: googleAccessToken, refreshToken: googleRefreshToken } = googleUser;

    if (!email) {
      throw new BadRequestException('Google account did not provide an email address');
    }

    // Check if account link already exists
    let account = await this.prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: 'google',
          providerAccountId,
        },
      },
      include: { user: true },
    });

    let targetUser: any;

    if (account) {
      targetUser = account.user;
    } else {
      // Check if user exists by email (Safe account linking)
      targetUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (targetUser) {
        // Link Google provider account to existing user
        await this.prisma.account.create({
          data: {
            userId: targetUser.id,
            type: 'oauth',
            provider: 'google',
            providerAccountId,
            accessToken: googleAccessToken,
            refreshToken: googleRefreshToken,
          },
        });

        // If email was not verified, verify it since Google verified it
        if (!targetUser.emailVerified) {
          targetUser = await this.prisma.user.update({
            where: { id: targetUser.id },
            data: { emailVerified: true, emailVerifiedAt: new Date() },
          });
        }
      } else {
        // Create brand new user + PlayerProfile + Account link
        const baseUsername = displayName
          ? displayName.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 15)
          : email.split('@')[0].slice(0, 15);
        const uniqueUsername = `${baseUsername || 'Contender'}_${Math.floor(1000 + Math.random() * 9000)}`;

        targetUser = await this.prisma.$transaction(async (tx) => {
          const newUser = await tx.user.create({
            data: {
              username: uniqueUsername,
              email,
              avatar: avatar || null,
              role: 'USER',
              emailVerified: true,
              emailVerifiedAt: new Date(),
            },
          });

          await tx.playerProfile.create({
            data: {
              userId: newUser.id,
              rank: 'ROOKIE',
              level: 1,
              xp: 0,
              title: 'Wanderer of Arcadia',
              reputationScore: 100,
              duelsWon: 0,
              matchesPlayed: 0,
            },
          });

          await tx.account.create({
            data: {
              userId: newUser.id,
              type: 'oauth',
              provider: 'google',
              providerAccountId,
              accessToken: googleAccessToken,
              refreshToken: googleRefreshToken,
            },
          });

          return newUser;
        });
      }
    }

    const tokens = await this.createTokensAndSession(targetUser, userAgent, ipAddress);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: this.sanitizeUser(targetUser),
    };
  }

  // ---------------------------------------------------------------------------
  // Helper: Token Generation & Session Record
  // ---------------------------------------------------------------------------
  private generateAccessToken(user: any): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const secret =
      this.configService.get<string>('JWT_ACCESS_SECRET') ||
      'arcadia_access_jwt_super_secret_key_prod_2026_983194124';
    const expiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m';

    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  private async createTokensAndSession(
    user: any,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.generateAccessToken(user);

    // Cryptographic Refresh Token
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const hashedToken = this.hashToken(rawRefreshToken);
    const family = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        hashedToken,
        userId: user.id,
        family,
        revoked: false,
        expiresAt,
      },
    });

    // Create active Session record
    await this.prisma.session.create({
      data: {
        sessionToken: crypto.randomUUID(),
        userId: user.id,
        userAgent,
        ipAddress,
        expiresAt,
      },
    });

    return { accessToken, refreshToken: rawRefreshToken };
  }
}

