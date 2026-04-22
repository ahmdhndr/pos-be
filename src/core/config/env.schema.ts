import { Type, plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

export enum NodeEnv {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

export class EnvSchema {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.DEVELOPMENT;

  @Type(() => Number)
  @IsNumber()
  PORT: number = 3000;

  // Database
  @IsString()
  @IsOptional()
  DB_HOST: string = 'localhost';

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  DB_PORT: number = 5432;

  @IsString()
  @IsOptional()
  DB_USER: string = 'postgres';

  @IsString()
  @IsOptional()
  DB_PASSWORD: string = 'password';

  @IsString()
  @IsOptional()
  DB_NAME: string = 'pos_system';

  // JWT
  @IsString()
  @IsOptional()
  JWT_SECRET: string = 'your-secret-key';

  @IsString()
  @IsOptional()
  JWT_EXPIRY: string = '7d';
}

export function validateEnv(config: Record<string, unknown>): EnvSchema {
  const validatedConfig = plainToInstance(EnvSchema, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    console.error('❌ Invalid environment variables:');
    errors.forEach((error) => {
      console.error(
        `  ${error.property}: ${Object.values(error.constraints || {}).join(', ')}`,
      );
    });
    process.exit(1);
  }

  return validatedConfig;
}
