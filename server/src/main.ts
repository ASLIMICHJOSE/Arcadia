import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import * as crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { AppModule } from './app.module';
import {
  resolveAllowedOrigins,
  resolveRequiredSecret,
  resolveTrustProxy,
} from './config/security.config';

async function bootstrap() {
  const logger = new Logger('ArcadiaBootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Express proxy trust so @Ip() and rate limiters inspect real client X-Forwarded-For behind Nginx / ALB / Cloudflare
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', resolveTrustProxy(configService.get<string>('TRUST_PROXY')));
  expressApp.disable('x-powered-by');

  // Enable NestJS shutdown hooks so SIGTERM drains active HTTP calls & closes Prisma/Redis/SMTP cleanly
  app.enableShutdownHooks();

  // Propagate or assign X-Request-Id for distributed tracing across load-balanced replicas
  app.use((req: Request, res: Response, next: NextFunction) => {
    const incomingId = req.headers['x-request-id'];
    const requestId =
      typeof incomingId === 'string' && incomingId.trim().length > 0 && incomingId.length <= 128
        ? incomingId.trim()
        : crypto.randomUUID();
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-Id', requestId);
    next();
  });

  // Global API Prefix
  app.setGlobalPrefix('api');

  // Strict Security Headers
  const isProd = configService.get<string>('NODE_ENV') === 'production';
  app.use(
    helmet({
      hidePoweredBy: true,
      noSniff: true,
      frameguard: { action: 'deny' },
      hsts: isProd
        ? { maxAge: 31536000, includeSubDomains: true, preload: true }
        : false,
      crossOriginResourcePolicy: { policy: 'same-site' },
    }),
  );

  // Signed Cookie Parser for HTTP-only Refresh Tokens & Sealed OAuth State
  const cookieSecret = resolveRequiredSecret(configService, 'COOKIE_SECRET');
  app.use(cookieParser(cookieSecret));

  // Strict CORS Allowlist Configuration
  const allowedOrigins = resolveAllowedOrigins(configService);
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      const normalized = origin.replace(/\/+$/, '');
      if (allowedOrigins.includes(normalized)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Request-Id'],
    maxAge: 600,
  });

  // Strict Request Body Validation & Sanitization
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = configService.get<number>('PORT', 4000);
  await app.listen(port, '0.0.0.0');
  logger.log(`Arcadia Authentication Core listening on 0.0.0.0:${port} [/api]`);
  logger.log(`Allowed CORS Origins: ${allowedOrigins.join(', ')}`);
}

bootstrap();
