import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResendVerificationDto } from './dto/resend-verification.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthenticatedUser } from './interfaces/jwt-payload.interface';
import { PrismaService } from '../prisma/prisma.service';

const REFRESH_COOKIE_NAME = 'arcadia_refresh';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  private clearRefreshTokenCookie(res: Response) {
    res.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      path: '/',
    });
  }

  // ---------------------------------------------------------------------------
  // Register
  // ---------------------------------------------------------------------------
  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // ---------------------------------------------------------------------------
  // Login
  // ---------------------------------------------------------------------------
  @Public()
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

    // Set secure HTTP-only refresh token cookie
    this.setRefreshTokenCookie(res, result.refreshToken);

    // Return access token, user, and initial profile
    return {
      accessToken: result.accessToken,
      user: result.user,
      profile: result.profile,
    };
  }

  // ---------------------------------------------------------------------------
  // Refresh Token Rotation
  // ---------------------------------------------------------------------------
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Ip() ip: string,
    @Body('refreshToken') bodyToken?: string,
  ) {
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME] || bodyToken;
    const userAgent = req.headers['user-agent'];

    const result = await this.authService.refreshTokens(rawRefreshToken, userAgent, ip);

    // Rotate refresh token cookie
    this.setRefreshTokenCookie(res, result.refreshToken);

    return {
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  // ---------------------------------------------------------------------------
  // Logout
  // ---------------------------------------------------------------------------
  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @CurrentUser('id') userId?: string,
  ) {
    const rawRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    await this.authService.logout(rawRefreshToken, userId);

    this.clearRefreshTokenCookie(res);
    return { message: 'Logged out successfully' };
  }

  // ---------------------------------------------------------------------------
  // Email Verification
  // ---------------------------------------------------------------------------
  @Public()
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Public()
  @Post('resend-verification')
  @HttpCode(HttpStatus.OK)
  async resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerification(dto.email);
  }

  // ---------------------------------------------------------------------------
  // Password Recovery
  // ---------------------------------------------------------------------------
  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // ---------------------------------------------------------------------------
  // Google OAuth 2.0
  // ---------------------------------------------------------------------------
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Initiates Google OAuth consent dialog
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: any,
    @Res() res: Response,
    @Ip() ip: string,
  ) {
    const userAgent = req.headers['user-agent'];
    const result = await this.authService.handleGoogleAuth(req.user, userAgent, ip);

    this.setRefreshTokenCookie(res, result.refreshToken);

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    // Redirect to frontend dashboard with token
    return res.redirect(
      `${frontendUrl}/dashboard?auth=success&token=${encodeURIComponent(result.accessToken)}`,
    );
  }

  // ---------------------------------------------------------------------------
  // Me (Profile & Progression)
  // ---------------------------------------------------------------------------
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

