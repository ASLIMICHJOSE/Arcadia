import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

@Injectable()
export class MailService implements OnModuleDestroy {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly isConfigured: boolean;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST')?.trim();
    const user = this.configService.get<string>('SMTP_USER')?.trim();
    const pass = this.configService.get<string>('SMTP_PASS')?.trim();

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: this.configService.get<number>('SMTP_PORT', 587),
        secure: this.configService.get<string>('SMTP_SECURE') === 'true',
        pool: true,
        maxConnections: 5,
        maxMessages: 100,
        connectionTimeout: 5000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
        auth: { user, pass },
      });
      this.isConfigured = true;
      this.logger.log(`Pooled SMTP Mail transport initialized via ${host}`);
    } else {
      this.isConfigured = false;
      this.logger.warn(
        'SMTP provider credentials are not configured. Operating in development dispatch mode.',
      );
    }
  }

  onModuleDestroy(): void {
    this.transporter?.close();
  }

  private getFrontendBaseUrl(): string {
    return (
      this.configService.get<string>('FRONTEND_URL')?.trim() || 'http://localhost:3000'
    ).replace(/\/+$/, '');
  }

  /**
   * Dispatches email asynchronously off the request critical path to avoid SMTP worker blocking
   * and prevent email-enumeration timing side-channels on password recovery.
   */
  private enqueueMail(mailOptions: nodemailer.SendMailOptions, label: string): void {
    if (!this.transporter) return;
    setImmediate(() => {
      this.transporter!
        .sendMail(mailOptions)
        .catch((err: Error) => {
          this.logger.error(`Async SMTP dispatch failed (${label}): ${err.message}`);
        });
    });
  }

  async sendVerificationEmail(email: string, rawToken: string, username: string): Promise<void> {
    const verificationUrl = `${this.getFrontendBaseUrl()}/verify-email?token=${encodeURIComponent(rawToken)}`;
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';

    if (!this.isConfigured || !this.transporter) {
      if (isProd) {
        this.logger.warn(`Verification dispatch skipped (SMTP unconfigured) for account.`);
      } else {
        this.logger.log(
          `\n=======================================================\n` +
            `[DEV DISPATCH] Verification Email to: ${email} (${username})\n` +
            `Action URL: ${verificationUrl}\n` +
            `=======================================================`,
        );
      }
      return;
    }

    const from =
      this.configService.get<string>('EMAIL_FROM') || 'Arcadia Security <security@arcadia.gaming>';

    this.enqueueMail(
      {
        from,
        to: email,
        subject: 'Verify your Arcadia Contender Account',
        html: `
          <div style="background-color: #1C0A0A; color: #FFFFFF; font-family: sans-serif; padding: 32px; border-radius: 16px; max-width: 540px; margin: 0 auto; border: 1px solid #381212;">
            <h2 style="color: #E34242; margin-top: 0;">Welcome to Arcadia, ${escapeHtml(username)}!</h2>
            <p style="color: #E5D5D2; font-size: 15px; line-height: 1.6;">
              Confirm your email address to unlock high-stakes arenas, global rankings, and persistent matchmaking statistics.
            </p>
            <div style="margin: 28px 0;">
              <a href="${verificationUrl}" style="background-color: #E34242; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: bold; display: inline-block; box-shadow: 0 0 16px rgba(227,66,66,0.6);">
                Verify Contender Email
              </a>
            </div>
            <p style="color: #C7A9A3; font-size: 12px;">This security link expires in 24 hours.</p>
          </div>
        `,
      },
      'verification',
    );
  }

  async sendPasswordResetEmail(email: string, rawToken: string): Promise<void> {
    const resetUrl = `${this.getFrontendBaseUrl()}/reset-password?token=${encodeURIComponent(rawToken)}`;
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';

    if (!this.isConfigured || !this.transporter) {
      if (isProd) {
        this.logger.warn(`Password reset dispatch skipped (SMTP unconfigured).`);
      } else {
        this.logger.log(
          `\n=======================================================\n` +
            `[DEV DISPATCH] Password Reset Email to: ${email}\n` +
            `Action URL: ${resetUrl}\n` +
            `=======================================================`,
        );
      }
      return;
    }

    const from =
      this.configService.get<string>('EMAIL_FROM') || 'Arcadia Security <security@arcadia.gaming>';

    this.enqueueMail(
      {
        from,
        to: email,
        subject: 'Reset your Arcadia Contender Password',
        html: `
          <div style="background-color: #1C0A0A; color: #FFFFFF; font-family: sans-serif; padding: 32px; border-radius: 16px; max-width: 540px; margin: 0 auto; border: 1px solid #381212;">
            <h2 style="color: #E34242; margin-top: 0;">Password Reset Request</h2>
            <p style="color: #E5D5D2; font-size: 15px; line-height: 1.6;">
              A credential recovery sequence was initiated for your Arcadia account.
            </p>
            <div style="margin: 28px 0;">
              <a href="${resetUrl}" style="background-color: #E34242; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 9999px; font-weight: bold; display: inline-block; box-shadow: 0 0 16px rgba(227,66,66,0.6);">
                Reset Password
              </a>
            </div>
            <p style="color: #C7A9A3; font-size: 12px;">This single-use link expires in 1 hour. If you did not make this request, ignore this message.</p>
          </div>
        `,
      },
      'password-reset',
    );
  }
}
