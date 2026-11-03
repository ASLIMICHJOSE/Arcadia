import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('ArcadiaBootstrap');
  const app = await NestFactory.create(AppModule);

  // Global API Prefix
  app.setGlobalPrefix('api');

  // Security Headers
  app.use(helmet());

  // Cookie Parser for HTTP-only Refresh Tokens
  const cookieSecret = process.env.COOKIE_SECRET || 'arcadia_cookie_secret_2026';
  app.use(cookieParser(cookieSecret));

  // CORS Configuration for Next.js PWA Client
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.enableCors({
    origin: [frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`Arcadia Authentication Core listening on port ${port} [/api]`);
  logger.log(`Allowed Origin: ${frontendUrl}`);
}

bootstrap();

