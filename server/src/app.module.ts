import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { ClientThrottlerGuard } from './common/client-throttler.guard';
import { RedisThrottlerStorage } from './common/redis-throttler.storage';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    HealthModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule, HealthModule],
      inject: [ConfigService, RedisThrottlerStorage],
      useFactory: (
        config: ConfigService,
        redisStorage: RedisThrottlerStorage,
      ) => ({
        throttlers: [
          {
            ttl: config.get<number>('THROTTLE_TTL', 60) * 1000,
            limit: config.get<number>('THROTTLE_LIMIT', 45),
          },
        ],
        storage: redisStorage,
      }),
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    MailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ClientThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
