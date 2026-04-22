import { EnvSchema } from '@core/config/env.schema';
import { ConfigService } from '@nestjs/config';

export function getEnv(configService: ConfigService): EnvSchema {
  return {
    NODE_ENV: configService.get('NODE_ENV')!,
    PORT: configService.get('PORT')!,
    DB_HOST: configService.get('DB_HOST')!,
    DB_PORT: configService.get('DB_PORT')!,
    DB_USER: configService.get('DB_USER')!,
    DB_PASSWORD: configService.get('DB_PASSWORD')!,
    DB_NAME: configService.get('DB_NAME')!,
    JWT_SECRET: configService.get('JWT_SECRET')!,
    JWT_EXPIRY: configService.get('JWT_EXPIRY')!,
  };
}
