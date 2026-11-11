import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
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
import { resolveRequiredSecret } from '../config/security.config';

// Valid pre-computed bcrypt cost-12 hash used for constant-time login mitigation when account does not exist
const DUMMY_PASSWORD_HASH =
  '$2b$12$C6UzMDM.H6dfI/f/IKxGhu5i0E2l5kV6x4uP4r9W0w8s7V6k6mY6.';

@Injectable()
export class AuthService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 12;
  private cleanupTimer: NodeJS.Timeout | null = null;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  onModuleInit(): void {
    // Skip periodic background timer under unit-test runners
    if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID) return;

    this.cleanupTimer = setInterval(() => {
      this.purgeExpiredAuthRecords().catch((err: Error) => {
        this.logger.warn(`Auth housekeeping skipped: ${err.message}`);
      });
    }, 60 * 60 * 1000); // hourly expired session / token purge

    if (typeof this.cleanupTimer.unref === 'function') {
      this.cleanupTimer.unref();
    }
  }

  onModuleDestroy(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  private async purgeExpiredAuthRecords(): Promise<void> {
    const now = new Date();
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    await Promise.all([
      this.prisma.session.deleteMany?.({ where: { expiresAt: { lt: now } } }),
      this.prisma.emailVerificationToken.deleteMany?.({ where: { expiresAt: { lt: now } } }),
      this.prisma.passwordResetToken.deleteMany?.({
        where: { OR: [{ expiresAt: { lt: now } }, { used: true, createdAt: { lt: weekAgo } }] },
      }),
      this.prisma.refreshToken.deleteMany?.({
        where: { OR: [{ expiresAt: { lt: now } }, { revoked: true, updatedAt: { lt: weekAgo } }] },
      }),
    ]);
  }

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

    const existingUsername = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username is already taken by another contender');
    }

    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingEmail) {
      throw new ConflictException('An account with this email address already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);

    let createdUser: any;
    let rawVerificationToken: string;

    try {
      rawVerificationToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = this.hashToken(rawVerificationToken);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      createdUser = await this.prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            username: dto.username,
            email: dto.email,
            passwordHash,
            role: 'USER',
            emailVerified: false,
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

        return newUser;
      });

      await this.prisma.emailVerificationToken.create({
        data: {
          hashedToken,
          email: createdUser.email,
          userId: createdUser.id,
          expiresAt,
        },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Username or email is already registered');
      }
      this.logger.error(`Registration error for ${dto.email}: ${(error as Error).message}`);
      throw new InternalServerErrorException('Failed to complete registration sequence');
    }

    // Dispatch verification email outside transaction catch so mail issues never break user creation
    try {
      await this.mailService.sendVerificationEmail(
        createdUser.email,
        rawVerificationToken,
        createdUser.username,
      );
    } catch (mailErr) {
      this.logger.warn(
        `Verification email dispatch deferred for ${createdUser.email}: ${(mailErr as Error).message}`,
      );
    }

    return {
      message:
        'Account successfully registered. Please verify your email address to unlock full features.',
      user: this.sanitizeUser(createdUser),
    };
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

    // Perform constant-time bcrypt comparison even when user is absent
    const candidateHash = user?.passwordHash || DUMMY_PASSWORD_HASH;
    const isPasswordValid = await bcrypt.compare(dto.password, candidateHash);

    if (!user || !user.passwordHash || !isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password credentials');
    }

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

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (tokenRecord.revoked) {
      this.logger.warn(
        `[SECURITY ALERT] Refresh token reuse detected for user ${tokenRecord.userId}! Revoking token family: ${tokenRecord.family}`,
      );
      await this.prisma.refreshToken.updateMany({
        where: { family: tokenRecord.family },
        data: { revoked: true },
      });
      await this.prisma.session.deleteMany({
        where: { userId: tokenRecord.userId },
      });
      // Increment tokenVersion if present in DB schema to invalidate active JWT access tokens immediately
      await this.prisma.user
        .update?.({
          where: { id: tokenRecord.userId },
          data: { tokenVersion: { increment: 1 } },
        })
        ?.catch(() => undefined);

      throw new UnauthorizedException(
        'Compromised session sequence detected. All sessions have been revoked for your security. Please log in again.',
      );
    }

    if (tokenRecord.expiresAt < new Date()) {
      await this.prisma.refreshToken.update({
        where: { id: tokenRecord.id },
        data: { revoked: true },
      });
      throw new UnauthorizedException('Refresh token has expired. Please log in again.');
    }

    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revoked: true },
    });

    const newAccessToken = this.generateAccessToken(tokenRecord.user);

    const newRawRefreshToken = crypto.randomBytes(40).toString('hex');
    const newHashedToken = this.hashToken(newRawRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: {
        hashedToken: newHashedToken,
        userId: tokenRecord.userId,
        family: tokenRecord.family,
        revoked: false,
        expiresAt,
      },
    });

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
  // 4. LOGOUT (Revoke Refresh Token Family, Session & Active JWT Version)
  // ---------------------------------------------------------------------------
  async logout(rawRefreshToken?: string, userId?: string): Promise<{ message: string }> {
    let targetUserId = userId;

    if (rawRefreshToken) {
      const hashedToken = this.hashToken(rawRefreshToken);
      const token = await this.prisma.refreshToken.findUnique({
        where: { hashedToken },
      });
      if (token) {
        targetUserId = targetUserId || token.userId;
        await this.prisma.refreshToken.updateMany({
          where: { family: token.family },
          data: { revoked: true },
        });
      }
    }

    if (targetUserId) {
      await this.prisma.session.deleteMany({
        where: { userId: targetUserId },
      });
      await this.prisma.user
        .update?.({
          where: { id: targetUserId },
          data: { tokenVersion: { increment: 1 } },
        })
        ?.catch(() => undefined);
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

    await this.prisma.user.update({
      where: { email: tokenRecord.email },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    await this.prisma.emailVerificationToken.delete({ where: { id: tokenRecord.id } });

    return { message: 'Contender email address has been successfully verified' };
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return {
        message:
          'If this email belongs to a contender account, a verification link has been dispatched.',
      };
    }

    if (user.emailVerified) {
      return {
        message:
          'If this email belongs to a contender account, a verification link has been dispatched.',
      };
    }

    await this.prisma.emailVerificationToken.deleteMany({ where: { email } });

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

    return {
      message:
        'If this email belongs to a contender account, a verification link has been dispatched.',
    };
  }

  // ---------------------------------------------------------------------------
  // 6. PASSWORD RECOVERY (Forgot / Reset)
  // ---------------------------------------------------------------------------
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return {
        message:
          'If an account exists for this email, password reset instructions have been sent.',
      };
    }

    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

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

    return {
      message:
        'If an account exists for this email, password reset instructions have been sent.',
    };
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
      throw new BadRequestException(
        'Password reset token has expired. Please initiate a new request.',
      );
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, this.saltRounds);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: tokenRecord.userId },
        data: {
          passwordHash,
          tokenVersion: { increment: 1 },
        },
      });

      await tx.passwordResetToken.update({
        where: { id: tokenRecord.id },
        data: { used: true },
      });

      await tx.refreshToken.updateMany({
        where: { userId: tokenRecord.userId },
        data: { revoked: true },
      });

      await tx.session.deleteMany({
        where: { userId: tokenRecord.userId },
      });
    });

    return {
      message:
        'Password successfully updated. All active sessions have been revoked. Please log in with your new credentials.',
    };
  }

  // ---------------------------------------------------------------------------
  // 7. GOOGLE OAUTH 2.0 / ACCOUNT LINKING
  // ---------------------------------------------------------------------------
  async handleGoogleAuth(
    googleUser: {
      providerAccountId: string;
      email: string;
      emailVerified: boolean;
      displayName?: string;
      avatar?: string | null;
    },
    userAgent?: string,
    ipAddress?: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: AuthenticatedUser }> {
    const { providerAccountId, email, emailVerified, displayName, avatar } = googleUser;

    if (!email || !emailVerified) {
      throw new BadRequestException('Verified Google email address is required');
    }

    const account = await this.prisma.account.findUnique({
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
      targetUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (targetUser) {
        await this.prisma.account.create({
          data: {
            userId: targetUser.id,
            type: 'oauth',
            provider: 'google',
            providerAccountId,
          },
        });

        if (!targetUser.emailVerified) {
          targetUser = await this.prisma.user.update({
            where: { id: targetUser.id },
            data: { emailVerified: true, emailVerifiedAt: new Date() },
          });
        }
      } else {
        const baseUsername = (
          displayName
            ? displayName.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 14)
            : email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 14)
        ) || 'Contender';

        targetUser = await this.prisma.$transaction(async (tx) => {
          let chosenUsername = `${baseUsername}_${crypto.randomBytes(2).toString('hex')}`;
          for (let attempt = 0; attempt < 5; attempt++) {
            const exists = await tx.user.findUnique({
              where: { username: chosenUsername },
              select: { id: true },
            });
            if (!exists) break;
            chosenUsername = `${baseUsername}_${crypto.randomBytes(3).toString('hex')}`;
          }

          const newUser = await tx.user.create({
            data: {
              username: chosenUsername,
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
      tv: user.tokenVersion ?? 0,
    };

    const secret = resolveRequiredSecret(this.configService, 'JWT_ACCESS_SECRET');
    const expiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m';

    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  private async createTokensAndSession(
    user: any,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = this.generateAccessToken(user);

    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const hashedToken = this.hashToken(rawRefreshToken);
    const family = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: {
        hashedToken,
        userId: user.id,
        family,
        revoked: false,
        expiresAt,
      },
    });

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
