import * as redisStore from 'cache-manager-ioredis';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './services/index.service';
import { redisConfig, typeormConfig } from './config';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
      store: redisStore,
        ...redisConfig(config),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => typeormConfig(config),
    }),
  ],
  exports: [
    RedisService,
  ],
  providers: [
    RedisService,
  ],
})
export class SharedModule {}
