import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Logger,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleOAuthService } from './strategies/google.strategy';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthenticatedUser, JwtPayload } from './interfaces/jwt-payload.interface';
import { PrismaService } from '../prisma/prisma.service';
import { resolveAllowedOrigins, resolveRequiredSecret } from '../config/security.config';

const REFRESH_COOKIE_NAME = 'arcadia_refresh';
const SESSION_HINT_COOKIE_NAME = 'arcadia_session_hint';
const OAUTH_STATE_COOKIE_NAME = 'arcadia_oauth_state';
const REFRESH_COOKIE_PATH = '/api/auth';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly googleOAuth: GoogleOAuthService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private isProduction(): boolean {
    return this.configService.get<string>('NODE_ENV') === 'production';
  }

  private getFrontendBaseUrl(): string {
    return (
      this.configService.get<string>('FRONTEND_URL')?.trim() || 'http://localhost:3000'
    ).replace(/\/+$/, '');
  }

  private assertTrustedOrigin(req: Request): void {
    const origin = req.headers.origin;
    if (!origin) return; // Same-origin/non-CORS server clients omit Origin header
    const allowed = resolveAllowedOrigins(this.configService);
    const normalized = origin.replace(/\/+$/, '');
    if (!allowed.includes(normalized)) {
      throw new ForbiddenException('Untrusted request origin');
    }
  }

  private setRefreshTokenCookie(res: Response, refreshToken: string): void {
    const isProd = this.isProduction();
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      path: REFRESH_COOKIE_PATH,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Non-sensitive session presence indicator scoped to '/' so Next.js 16 proxy.ts can perform optimistic routing
    res.cookie(SESSION_HINT_COOKIE_NAME, '1', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  private clearRefreshTokenCookie(res: Response): void {
    const isProd = this.isProduction();
    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      path: REFRESH_COOKIE_PATH,
    });
    res.clearCookie(SESSION_HINT_COOKIE_NAME, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });
  }

  private extractBearerUserId(req: Request): string | undefined {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return undefined;
    try {
      const token = authHeader.slice(7).trim();
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: resolveRequiredSecret(this.configService, 'JWT_ACCESS_SECRET'),
      });
      return payload?.sub;
    } catch {
      return undefined;
    }
  }

  // ---------------------------------------------------------------------------
  // Register
  // ---------------------------------------------------------------------------
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // ---------------------------------------------------------------------------
  // Login
  // ---------------------------------------------------------------------------
  @Public()
  @Throttle({ default: { limit: 8, ttl: 60000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
  ) {
    const userAgent = req.headers['user-agent'];
    const result = await this.authService.login(dto, userAgent, ip);

    this.setRefreshTokenCookie(res, result.refreshToken);

    return {
      accessToken: result.accessToken,
      user: result.user,
      profile: result.profile,
    };
  }

  // ---------------------------------------------------------------------------
  // Refresh Token Rotation (HTTP-only cookie only)
  // ---------------------------------------------------------------------------
  @Public()
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
  ) {
    this.assertTrustedOrigin(req);

    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    const userAgent = req.headers['user-agent'];

    try {
      const result = await this.authService.refreshTokens(rawRefreshToken, userAgent, ip);
      this.setRefreshTokenCookie(res, result.refreshToken);

      return {
        accessToken: result.accessToken,
        user: result.user,
      };
    } catch (err) {
      this.clearRefreshTokenCookie(res);
      throw err;
    }
  }

  // ---------------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------------
  @Public()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.assertTrustedOrigin(req);

    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    const bearerUserId = this.extractBearerUserId(req);

    await this.authService.logout(rawRefreshToken, bearerUserId);
    this.clearRefreshTokenCookie(res);

    return { message: 'Logged out successfully' };
  }

  // ---------------------------------------------------------------------------
  // Email Verification
  // ---------------------------------------------------------------------------
  @Public()
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @Get('verify-email')
  async verifyEmail(@Query() query: VerifyEmailDto) {
    return this.authService.verifyEmail(query.token);
  }

  @Public()
  @Throttle({ default: { limit: 4, ttl: 60000 } })
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerification(dto.email);
  }

  // ---------------------------------------------------------------------------
  // Password Recovery
  // ---------------------------------------------------------------------------
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Throttle({ default: { limit: 6, ttl: 60000 } })
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // ---------------------------------------------------------------------------
  // Google OAuth 2.0 + OIDC + Stateless PKCE & State Protection
  // ---------------------------------------------------------------------------
  @Public()
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @Get('google')
  async googleAuth(@Res() res: Response) {
    const { authUrl, sealedStateCookie } = this.googleOAuth.initiateAuthorization();
    const isProd = this.isProduction();

    res.cookie(OAUTH_STATE_COOKIE_NAME, sealedStateCookie, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/api/auth/google',
      maxAge: 5 * 60 * 1000,
    });

    return res.redirect(authUrl);
  }

  @Public()
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') oauthError: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
    @Ip() ip: string,
  ) {
    const isProd = this.isProduction();
    const frontendUrl = this.getFrontendBaseUrl();
    const sealedStateCookie = req.cookies?.[OAUTH_STATE_COOKIE_NAME];

    // Always clear temporary OAuth state cookie immediately
    res.clearCookie(OAUTH_STATE_COOKIE_NAME, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/api/auth/google',
    });

    if (oauthError || !code || !state) {
      return res.redirect(`${frontendUrl}/login?error=oauth_cancelled`);
    }

    try {
      const profile = await this.googleOAuth.exchangeAndVerifyCallback(
        code,
        state,
        sealedStateCookie,
      );

      const userAgent = req.headers['user-agent'];
      const result = await this.authService.handleGoogleAuth(profile, userAgent, ip);

      this.setRefreshTokenCookie(res, result.refreshToken);

      // Never pass bearer JWT in redirect query params; client exchanges HTTP-only refresh cookie on mount
      return res.redirect(`${frontendUrl}/dashboard?auth=success`);
    } catch (err) {
      this.logger.warn(`Google OAuth callback rejected: ${(err as Error).message}`);
      return res.redirect(`${frontendUrl}/login?error=oauth_failed`);
    }
  }

  // ---------------------------------------------------------------------------
  // Me (Profile & Progression)
  // ---------------------------------------------------------------------------
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  @Get('me')
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    const fullUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      include: {
        playerProfile: true,
        accounts: {
          select: {
            provider: true,
            createdAt: true,
          },
        },
      },
    });

    if (!fullUser) {
      throw new UnauthorizedException('Account no longer exists');
    }

    return {
      user: {
        id: fullUser.id,
        username: fullUser.username,
        email: fullUser.email,
        role: fullUser.role,
        avatar: fullUser.avatar,
        emailVerified: fullUser.emailVerified,
        createdAt: fullUser.createdAt,
        updatedAt: fullUser.updatedAt,
      },
      profile: fullUser.playerProfile,
      connectedAccounts: fullUser.accounts,
    };
  }
}
