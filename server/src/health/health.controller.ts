import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { Public } from '../auth/decorators/public.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { RedisThrottlerStorage } from '../common/redis-throttler.storage';

@Controller('health')
export class HealthController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly throttlerStorage: RedisThrottlerStorage,
  ) {}

  /**
   * Liveness probe for load balancers, Kubernetes, and Docker healthcheck.
   */
  @Public()
  @SkipThrottle()
  @Get()
  @HttpCode(HttpStatus.OK)
  liveness() {
    return {
      status: 'ok',
      service: 'arcadia-auth-core',
      uptimeSec: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Readiness probe verifying PostgreSQL connectivity (and Redis if configured).
   * Returns 503 if dependencies are unavailable so load balancers drain the instance.
   */
  @Public()
  @SkipThrottle()
  @Get('ready')
  @HttpCode(HttpStatus.OK)
  async readiness() {
    let dbOk = false;
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbOk = true;
    } catch {
      dbOk = false;
    }

    const redisOk = await this.throttlerStorage.ping();

    if (!dbOk || !redisOk) {
      throw new ServiceUnavailableException({
        status: 'degraded',
        checks: {
          database: dbOk ? 'up' : 'down',
          redis: this.throttlerStorage.isRedisEnabled
            ? redisOk
              ? 'up'
              : 'down'
            : 'local-fallback',
        },
      });
    }

    return {
      status: 'ready',
      checks: {
        database: 'up',
        redis: this.throttlerStorage.isRedisEnabled ? 'up' : 'local-fallback',
      },
      timestamp: new Date().toISOString(),
    };
  }
}

