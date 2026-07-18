import { plainToInstance } from 'class-transformer';
import { IsIn, IsNumber, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsIn(['development', 'production', 'test'])
  NODE_ENV!: string;

  @IsNumber()
  PORT!: number;

  @IsString()
  DATABASE_URL!: string;

  @IsString()
  REDIS_HOST!: string;

  @IsNumber()
  REDIS_PORT!: number;

  @IsString()
  JWT_SECRET!: string;

  @IsString()
  CORS_ORIGIN!: string;

  @IsString()
  LIBRARY_PATH!: string;
}

export function validateEnv(config: Record<string, unknown>): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(`Environment validation failed: ${errors.toString()}`);
  }

  return validated;
}
