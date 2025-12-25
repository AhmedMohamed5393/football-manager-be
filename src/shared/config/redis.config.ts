import { ConfigService } from "@nestjs/config";

export function redisConfig(configService: ConfigService) {
  return {
    host: configService.getOrThrow('REDIS_HOST'),
    port: +configService.getOrThrow('REDIS_PORT'),
    ttl: +configService.getOrThrow('REDIS_TTL'),
    isGlobal: true,
  };
}
