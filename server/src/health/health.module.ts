import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthController } from './health.controller';
import { RedisThrottlerStorage } from '../common/redis-throttler.storage';

@Global()
@Module({
  imports: [ConfigModule],
  controllers: [HealthController],
  providers: [
    {
      provide: RedisThrottlerStorage,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new RedisThrottlerStorage(config.get<string>('REDIS_URL')),
    },
  ],
  exports: [RedisThrottlerStorage],
})
export class HealthModule {}

