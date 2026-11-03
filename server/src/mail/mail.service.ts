import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private readonly isConfigured: boolean;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('SMTP_HOST');
    const user = this.configService.get<string>('SMTP_USER');
    const pass = this.configService.get<string>('SMTP_PASS');

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: this.configService.get<number>('SMTP_PORT', 587),
        secure: this.configService.get<boolean>('SMTP_SECURE', false),
        auth: { user, pass },
      });
      this.isConfigured = true;
      this.logger.log(`SMTP Mail transport initialized via ${host}`);
    } else {
      this.isConfigured = false;
      this.logger.warn(
        'SMTP provider credentials are not configured. Operating in development dispatch mode (links logged directly to console output).',
      );
    }
  }

  async sendVerificationEmail(email: string, rawToken: string, username: string): Promise<void> {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const verificationUrl = `${frontendUrl}/verify-email?token=${rawToken}`;

    if (!this.isConfigured || !this.transporter) {
      this.logger.log(
        `\n=======================================================\n` +
          `[DEV DISPATCH] Verification Email to: ${email} (${username})\n` +
          `Action URL: ${verificationUrl}\n` +
          `=======================================================`,
      );
      return;
    }

    const from =
      this.configService.get<string>('EMAIL_FROM') || 'Arcadia Security <security@arcadia.gaming>';

    await this.transporter.sendMail({
      from,
      to: email,
      subject: 'Verify your Arcadia Contender Account',
      html: `
        <div style="background-color: #1C0A0A; color: #FFFFFF; font-family: sans-serif; padding: 32px; border-radius: 16px; max-width: 540px; margin: 0 auto; border: 1px solid #381212;">
          <h2 style="color: #E34242; margin-top: 0;">Welcome to Arcadia, ${username}!</h2>
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
    });
  }

  async sendPasswordResetEmail(email: string, rawToken: string): Promise<void> {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}`;

    if (!this.isConfigured || !this.transporter) {
      this.logger.log(
        `\n=======================================================\n` +
          `[DEV DISPATCH] Password Reset Email to: ${email}\n` +
          `Action URL: ${resetUrl}\n` +
          `=======================================================`,
      );
      return;
    }

    const from =
      this.configService.get<string>('EMAIL_FROM') || 'Arcadia Security <security@arcadia.gaming>';

    await this.transporter.sendMail({
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
    });
  }
}

