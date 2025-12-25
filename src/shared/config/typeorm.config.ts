import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export function typeormConfig(
  configService: ConfigService,
  migrations?: TypeOrmModuleOptions['migrations'],
): TypeOrmModuleOptions {
  const config = {
    type: 'postgres' as const,
    host: configService.getOrThrow('DATABASE_HOST'),
    port: configService.getOrThrow('DATABASE_PORT'),
    username: configService.getOrThrow('DATABASE_USER'),
    password: configService.getOrThrow('DATABASE_PASSWORD'),
    database: configService.getOrThrow('DATABASE_NAME'),
    entities: ['dist/../**/*.entity.js'],
    synchronize: false,
    extra: {
      encrypt: configService.getOrThrow('NODE_ENV') === 'production',
      enableArithAbort: true,
    },
    subscribers: [],
    migrations: migrations,
  };

  if (configService.getOrThrow('NODE_ENV') === 'production') {
    Object.assign(config, {
      url: configService.getOrThrow('DATABASE_URL'),
      ssl: { rejectUnauthorized: false },
    });
  } else {
    Object.assign(config, { ssl: false });
  }

  return config;
}
