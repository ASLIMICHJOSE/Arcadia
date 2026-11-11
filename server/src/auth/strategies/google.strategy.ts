import {
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { resolveRequiredSecret } from '../../config/security.config';

export interface VerifiedGoogleProfile {
  provider: 'google';
  providerAccountId: string;
  email: string;
  emailVerified: boolean;
  displayName: string;
  avatar: string | null;
}

interface SealedOAuthState {
  state: string;
  codeVerifier: string;
  exp: number;
}

@Injectable()
export class GoogleOAuthService {
  private readonly logger = new Logger(GoogleOAuthService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly callbackUrl: string;
  private readonly stateKey: Buffer;

  constructor(private readonly configService: ConfigService) {
    this.clientId = configService.get<string>('GOOGLE_CLIENT_ID')?.trim() || '';
    this.clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET')?.trim() || '';
    this.callbackUrl =
      configService.get<string>('GOOGLE_CALLBACK_URL')?.trim() ||
      'http://localhost:4000/api/auth/google/callback';

    const rawSecret = resolveRequiredSecret(configService, 'COOKIE_SECRET');
    this.stateKey = crypto.createHash('sha256').update(`arcadia-oauth:${rawSecret}`).digest();

    if (!this.isConfigured()) {
      this.logger.warn(
        'Google OAuth 2.0 credentials not configured (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET). Google sign-in endpoints will fail closed with 503.',
      );
    }
  }

  isConfigured(): boolean {
    return Boolean(
      this.clientId &&
        this.clientSecret &&
        !this.clientId.startsWith('DUMMY') &&
        !this.clientSecret.startsWith('DUMMY'),
    );
  }

  /**
   * Generates authorization URL with CSPRNG state + PKCE S256 challenge and
   * returns an AES-256-GCM sealed cookie string so callbacks work statelessly across any replica.
   */
  initiateAuthorization(): { authUrl: string; sealedStateCookie: string } {
    if (!this.isConfigured()) {
      throw new ServiceUnavailableException(
        'Google OAuth is not configured on this server.',
      );
    }

    const state = crypto.randomBytes(24).toString('base64url');
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const codeChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');

    const payload: SealedOAuthState = {
      state,
      codeVerifier,
      exp: Date.now() + 5 * 60 * 1000, // 5 minute OAuth flow lifetime
    };

    const sealedStateCookie = this.sealPayload(payload);

    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.callbackUrl,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      prompt: 'select_account',
    });

    return {
      authUrl: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
      sealedStateCookie,
    };
  }

  /**
   * Validates OAuth state cookie (CSRF check), exchanges authorization code with PKCE code_verifier,
   * and verifies Google OIDC identity claims (issuer, audience, expiration, email_verified).
   */
  async exchangeAndVerifyCallback(
    code: string,
    returnedState: string,
    sealedStateCookie?: string,
  ): Promise<VerifiedGoogleProfile> {
    if (!this.isConfigured()) {
      throw new ServiceUnavailableException(
        'Google OAuth is not configured on this server.',
      );
    }

    if (!code || !returnedState || !sealedStateCookie) {
      throw new UnauthorizedException('Invalid or missing OAuth state parameters.');
    }

    const saved = this.unsealPayload(sealedStateCookie);
    if (!saved || saved.exp < Date.now()) {
      throw new UnauthorizedException('OAuth login session expired. Please try again.');
    }

    const expectedBuf = Buffer.from(saved.state, 'utf8');
    const returnedBuf = Buffer.from(returnedState, 'utf8');
    if (
      expectedBuf.length !== returnedBuf.length ||
      !crypto.timingSafeEqual(expectedBuf, returnedBuf)
    ) {
      throw new UnauthorizedException('OAuth state verification failed (possible CSRF).');
    }

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.callbackUrl,
        grant_type: 'authorization_code',
        code_verifier: saved.codeVerifier,
      }).toString(),
      signal: AbortSignal.timeout(8000),
    });

    if (!tokenRes.ok) {
      throw new UnauthorizedException('Failed to exchange Google authorization code.');
    }

    const tokenJson = (await tokenRes.json()) as {
      id_token?: string;
      access_token?: string;
    };

    if (!tokenJson.id_token) {
      throw new UnauthorizedException('Google did not return an OpenID Connect ID token.');
    }

    // Parse & validate ID token claims directly received over TLS from Google's token endpoint
    const parts = tokenJson.id_token.split('.');
    if (parts.length !== 3) {
      throw new UnauthorizedException('Malformed Google ID token.');
    }

    let claims: Record<string, unknown>;
    try {
      claims = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    } catch {
      throw new UnauthorizedException('Invalid Google ID token payload.');
    }

    const issuer = String(claims.iss || '');
    const audience = String(claims.aud || '');
    const expSec = Number(claims.exp || 0);
    const sub = String(claims.sub || '');
    const email = String(claims.email || '').toLowerCase().trim();
    const emailVerified = claims.email_verified === true || claims.email_verified === 'true';

    if (
      issuer !== 'https://accounts.google.com' &&
      issuer !== 'accounts.google.com'
    ) {
      throw new UnauthorizedException('Untrusted OIDC token issuer.');
    }

    if (audience !== this.clientId) {
      throw new UnauthorizedException('OIDC audience mismatch.');
    }

    if (!expSec || expSec * 1000 <= Date.now()) {
      throw new UnauthorizedException('Expired Google ID token.');
    }

    if (!sub || !email) {
      throw new UnauthorizedException('Google profile did not include required identity claims.');
    }

    if (!emailVerified) {
      throw new UnauthorizedException('Google email address must be verified before sign-in.');
    }

    return {
      provider: 'google',
      providerAccountId: sub,
      email,
      emailVerified: true,
      displayName: String(claims.name || claims.given_name || 'Contender'),
      avatar:
        typeof claims.picture === 'string' && claims.picture.startsWith('https://')
          ? claims.picture
          : null,
    };
  }

  private sealPayload(payload: SealedOAuthState): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.stateKey, iv);
    const json = Buffer.from(JSON.stringify(payload), 'utf8');
    const encrypted = Buffer.concat([cipher.update(json), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('base64url')}.${encrypted.toString('base64url')}.${tag.toString('base64url')}`;
  }

  private unsealPayload(sealed: string): SealedOAuthState | null {
    try {
      const parts = sealed.split('.');
      if (parts.length !== 3) return null;
      const iv = Buffer.from(parts[0], 'base64url');
      const encrypted = Buffer.from(parts[1], 'base64url');
      const tag = Buffer.from(parts[2], 'base64url');
      if (iv.length !== 12 || tag.length !== 16) return null;
      const decipher = crypto.createDecipheriv('aes-256-gcm', this.stateKey, iv);
      decipher.setAuthTag(tag);
      const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
      return JSON.parse(decrypted.toString('utf8')) as SealedOAuthState;
    } catch {
      return null;
    }
  }
}
