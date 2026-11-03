import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

describe('AuthService (Phase 3 Authentication Core)', () => {
  let authService: AuthService;
  let prisma: any;
  let jwtService: any;
  let mailService: any;

  const mockUser = {
    id: 'user-uuid-1234',
    username: 'ShadowBlade',
    email: 'shadow@arcadia.gaming',
    passwordHash: '',
    role: 'USER',
    avatar: null,
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    playerProfile: {
      id: 'profile-uuid-1234',
      rank: 'ROOKIE',
      level: 1,
      xp: 0,
      title: 'Wanderer of Arcadia',
      reputationScore: 100,
      duelsWon: 0,
      matchesPlayed: 0,
    },
  };

  beforeAll(async () => {
    // Generate valid bcrypt hash for test user
    mockUser.passwordHash = await bcrypt.hash('SecureGamingPass1!', 10);
  });

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      playerProfile: {
        create: jest.fn(),
        update: jest.fn(),
      },
      refreshToken: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
      session: {
        create: jest.fn(),
        deleteMany: jest.fn(),
      },
      emailVerificationToken: {
        findUnique: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
      passwordResetToken: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        deleteMany: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback(prisma)),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mocked.jwt.access.token'),
      verify: jest.fn(),
    };

    const configService = {
      get: jest.fn((key: string, defaultValue?: any) => {
        if (key === 'JWT_ACCESS_SECRET') return 'test_secret';
        if (key === 'JWT_ACCESS_EXPIRES_IN') return '15m';
        return defaultValue;
      }),
    };

    mailService = {
      sendVerificationEmail: jest.fn().mockResolvedValue(undefined),
      sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        { provide: MailService, useValue: mailService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  // =========================================================================
  // 1. REGISTRATION TESTS
  // =========================================================================
  describe('Registration', () => {
    it('should successfully register a new user, hash password, initialize profile, and send verification email', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      prisma.user.create.mockResolvedValueOnce(mockUser);
      prisma.emailVerificationToken.create.mockResolvedValueOnce({});

      const result = await authService.register({
        username: 'ShadowBlade',
        email: 'shadow@arcadia.gaming',
        password: 'SecureGamingPass1!',
        confirmPassword: 'SecureGamingPass1!',
      });

      expect(result).toBeDefined();
      expect(result.user.username).toBe('ShadowBlade');
      expect(result.user.email).toBe('shadow@arcadia.gaming');
      expect(result.user.emailVerified).toBe(false);
      expect(prisma.playerProfile.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: mockUser.id,
            rank: 'ROOKIE',
            level: 1,
            title: 'Wanderer of Arcadia',
          }),
        }),
      );
      expect(mailService.sendVerificationEmail).toHaveBeenCalled();
    });

    it('should reject registration when password confirmation does not match', async () => {
      await expect(
        authService.register({
          username: 'ShadowBlade',
          email: 'shadow@arcadia.gaming',
          password: 'SecureGamingPass1!',
          confirmPassword: 'DifferentPass2@',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject duplicate username with ConflictException', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(mockUser); // username collision

      await expect(
        authService.register({
          username: 'ShadowBlade',
          email: 'newemail@arcadia.gaming',
          password: 'SecureGamingPass1!',
          confirmPassword: 'SecureGamingPass1!',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should reject duplicate email with ConflictException', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(null) // username ok
        .mockResolvedValueOnce(mockUser); // email collision

      await expect(
        authService.register({
          username: 'DifferentName',
          email: 'shadow@arcadia.gaming',
          password: 'SecureGamingPass1!',
          confirmPassword: 'SecureGamingPass1!',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  // =========================================================================
  // 2. LOGIN TESTS
  // =========================================================================
  describe('Login', () => {
    it('should successfully log in with valid credentials, issue access token, and create session', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(mockUser);
      prisma.refreshToken.create.mockResolvedValueOnce({});
      prisma.session.create.mockResolvedValueOnce({});

      const result = await authService.login(
        {
          email: 'shadow@arcadia.gaming',
          password: 'SecureGamingPass1!',
        },
        'Mozilla/5.0 TestBrowser',
        '127.0.0.1',
      );

      expect(result.accessToken).toBe('mocked.jwt.access.token');
      expect(result.refreshToken).toBeDefined();
      expect(typeof result.refreshToken).toBe('string');
      expect(result.user.username).toBe('ShadowBlade');
      expect(prisma.refreshToken.create).toHaveBeenCalled();
      expect(prisma.session.create).toHaveBeenCalled();
    });

    it('should reject login when user email does not exist', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      await expect(
        authService.login({
          email: 'ghost@arcadia.gaming',
          password: 'SecureGamingPass1!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should reject login with invalid password', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(mockUser);

      await expect(
        authService.login({
          email: 'shadow@arcadia.gaming',
          password: 'WrongPassword999!',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  // =========================================================================
  // 3. REFRESH TOKEN ROTATION & REUSE DETECTION
  // =========================================================================
  describe('Refresh Token Rotation & Reuse Detection', () => {
    it('should rotate valid refresh token: revoke current token and issue new token in same family', async () => {
      const mockRecord = {
        id: 'token-uuid-1',
        hashedToken: 'hash123',
        userId: mockUser.id,
        family: 'family-uuid-alpha',
        revoked: false,
        expiresAt: new Date(Date.now() + 1000000),
        user: mockUser,
      };

      prisma.refreshToken.findUnique.mockResolvedValueOnce(mockRecord);
      prisma.refreshToken.update.mockResolvedValueOnce({ ...mockRecord, revoked: true });
      prisma.refreshToken.create.mockResolvedValueOnce({});
      prisma.session.create.mockResolvedValueOnce({});

      const result = await authService.refreshTokens('validRawToken12345');

      expect(result.accessToken).toBe('mocked.jwt.access.token');
      expect(result.refreshToken).toBeDefined();
      // Current token revoked
      expect(prisma.refreshToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockRecord.id },
          data: { revoked: true },
        }),
      );
      // New token issued with same family
      expect(prisma.refreshToken.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: mockUser.id,
            family: mockRecord.family,
            revoked: false,
          }),
        }),
      );
    });

    it('should DETECT REUSE: if a revoked token is presented, revoke all tokens in family and clear sessions', async () => {
      const compromisedRecord = {
        id: 'compromised-token-id',
        hashedToken: 'compromised_hash',
        userId: mockUser.id,
        family: 'family-compromised-uuid',
        revoked: true, // Already consumed / revoked!
        expiresAt: new Date(Date.now() + 1000000),
        user: mockUser,
      };

      prisma.refreshToken.findUnique.mockResolvedValueOnce(compromisedRecord);

      await expect(authService.refreshTokens('stolenReusedToken')).rejects.toThrow(
        UnauthorizedException,
      );

      // Verify entire family was revoked for security
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { family: compromisedRecord.family },
        data: { revoked: true },
      });
      // Verify sessions destroyed
      expect(prisma.session.deleteMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
      });
    });

    it('should reject expired refresh token', async () => {
      const expiredRecord = {
        id: 'expired-token-id',
        hashedToken: 'expired_hash',
        userId: mockUser.id,
        family: 'family-expired',
        revoked: false,
        expiresAt: new Date(Date.now() - 10000), // In the past!
        user: mockUser,
      };

      prisma.refreshToken.findUnique.mockResolvedValueOnce(expiredRecord);

      await expect(authService.refreshTokens('expiredRawToken')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // =========================================================================
  // 4. PASSWORD RESET & SESSION REVOCATION
  // =========================================================================
  describe('Password Recovery & Session Invalidation', () => {
    it('should never reveal if an email does not exist on forgotPassword', async () => {
      prisma.user.findUnique.mockResolvedValueOnce(null);

      const res = await authService.forgotPassword('nonexistent@arcadia.gaming');
      expect(res.message).toContain('If an account exists');
      expect(mailService.sendPasswordResetEmail).not.toHaveBeenCalled();
    });

    it('should reset password and REVOKE ALL active sessions and refresh tokens', async () => {
      const mockResetRecord = {
        id: 'reset-token-id',
        hashedToken: 'some_hashed_token',
        userId: mockUser.id,
        expiresAt: new Date(Date.now() + 100000),
        used: false,
      };

      prisma.passwordResetToken.findUnique.mockResolvedValueOnce(mockResetRecord);

      const result = await authService.resetPassword({
        token: 'rawValidResetToken',
        newPassword: 'BrandNewSecurePassword123!',
        confirmPassword: 'BrandNewSecurePassword123!',
      });

      expect(result.message).toContain('Password successfully updated');
      // Token marked used
      expect(prisma.passwordResetToken.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mockResetRecord.id },
          data: { used: true },
        }),
      );
      // All sessions and refresh tokens revoked
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
        data: { revoked: true },
      });
      expect(prisma.session.deleteMany).toHaveBeenCalledWith({
        where: { userId: mockUser.id },
      });
    });
  });

  // =========================================================================
  // 5. EMAIL VERIFICATION
  // =========================================================================
  describe('Email Verification', () => {
    it('should successfully verify email with valid token and mark user as verified', async () => {
      const mockVerifyRecord = {
        id: 'verify-id',
        hashedToken: 'hashed_verify',
        email: mockUser.email,
        expiresAt: new Date(Date.now() + 100000),
      };

      prisma.emailVerificationToken.findUnique.mockResolvedValueOnce(mockVerifyRecord);
      prisma.user.update.mockResolvedValueOnce({ ...mockUser, emailVerified: true });

      const result = await authService.verifyEmail('validToken');
      expect(result.message).toContain('successfully verified');
      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { email: mockUser.email },
          data: expect.objectContaining({ emailVerified: true }),
        }),
      );
      expect(prisma.emailVerificationToken.delete).toHaveBeenCalledWith({
        where: { id: mockVerifyRecord.id },
      });
    });
  });
});

