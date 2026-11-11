import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as crypto from 'crypto';

const logger = new Logger('SecurityConfig');

const KNOWN_PLACEHOLDER_SECRETS = new Set<string>([
  'arcadia_access_jwt_super_secret_key_prod_2026_983194124',
  'arcadia_refresh_jwt_super_secret_key_prod_2026_55219084',
  'arcadia_secure_http_only_cookie_signing_secret_9941241',
  'arcadia_cookie_secret_2026',
  'changeme',
  'secret',
]);

// Stable per-process ephemeral dev secrets when env vars are missing/placeholders in non-production
const ephemeralDevSecrets = new Map<string, string>();

/**
 * Resolves a cryptographic signing secret with fail-closed enforcement in production.
 * In development/test, generates a per-process random fallback instead of using a static string literal.
 */
export function resolveRequiredSecret(
  configService: ConfigService,
  envKey: string,
  minLength = 32,
): string {
  const isProd = configService.get<string>('NODE_ENV') === 'production';
  const raw = configService.get<string>(envKey)?.trim() || '';
  const isMissingOrWeak =
    !raw || raw.length < minLength || KNOWN_PLACEHOLDER_SECRETS.has(raw);

  if (isProd && isMissingOrWeak) {
    throw new Error(
      `[SECURITY FATAL] "${envKey}" must be set to a unique cryptographically strong secret (min ${minLength} chars) in production.`,
    );
  }

  if (isMissingOrWeak) {
    if (!ephemeralDevSecrets.has(envKey)) {
      const generated = crypto.randomBytes(32).toString('hex');
      ephemeralDevSecrets.set(envKey, generated);
      logger.warn(
        `[DEV SECURITY] "${envKey}" is missing, short, or using an example placeholder. Generated ephemeral CSPRNG secret for this process.`,
      );
    }
    return ephemeralDevSecrets.get(envKey)!;
  }

  return raw;
}

/**
 * Builds the CORS allow-list from CORS_ORIGINS / FRONTEND_URL while permitting loopback only outside production.
 */
export function resolveAllowedOrigins(configService: ConfigService): string[] {
  const isProd = configService.get<string>('NODE_ENV') === 'production';
  const origins = new Set<string>();

  const frontendUrl = configService.get<string>('FRONTEND_URL')?.trim();
  if (frontendUrl) {
    origins.add(frontendUrl.replace(/\/+$/, ''));
  }

  const extraOrigins = configService.get<string>('CORS_ORIGINS')?.trim();
  if (extraOrigins) {
    for (const entry of extraOrigins.split(',')) {
      const trimmed = entry.trim().replace(/\/+$/, '');
      if (trimmed) origins.add(trimmed);
    }
  }

  if (!isProd) {
    origins.add('http://localhost:3000');
    origins.add('http://127.0.0.1:3000');
  }

  return Array.from(origins);
}

/**
 * Parses Express `trust proxy` configuration so rate limiting and @Ip() honor X-Forwarded-For behind load balancers.
 */
export function resolveTrustProxy(raw?: string): boolean | number | string {
  const value = raw?.trim();
  if (!value) return 1; // Default: trust first reverse proxy hop (Nginx / ALB / Cloudflare)
  if (value === 'false' || value === '0') return false;
  if (value === 'true') return true;
  if (/^\d+$/.test(value)) return parseInt(value, 10);
  return value;
}

/**
 * Extracts real client IP behind reverse proxies while rejecting oversized or malformed headers.
 */
export function extractClientIp(req: { ip?: string; headers?: Record<string, string | string[] | undefined>; socket?: { remoteAddress?: string } }): string {
  if (req.ip) return req.ip;
  const forwarded = req.headers?.['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

