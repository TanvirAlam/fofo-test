import dotenv from 'dotenv';
import { z } from 'zod';

import { DEVELOPMENT, MB, MINUTE, PRODUCTION, SECOND } from '../utils/constant';

// Load environment variables
dotenv.config();

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum([DEVELOPMENT, PRODUCTION]).default(DEVELOPMENT),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('7d'),
  DATABASE_URL: z.string().url(),
  DB_MAX_POOL_SIZE: z.coerce.number().optional(),
  DB_IDLE_TIMEOUT_MS: z.coerce.number().default(30 * SECOND),
  DB_CONN_TIMEOUT_MS: z.coerce.number().optional(),
  DB_STATEMENT_TIMEOUT_MS: z.coerce.number().default(30 * SECOND),
  DB_QUERY_TIMEOUT_MS: z.coerce.number().default(30 * SECOND),
  REDIS_URL: z.string().default('redis://localhost:6379'),

  UPLOAD_PATH: z.string().default('./uploads'),
  MAX_FILE_SIZE: z.coerce.number().default(5 * MB),

  CORS_ORIGINS: z.string().optional(),

  RATE_LIMIT_WINDOW: z.coerce.number().default(15 * MINUTE),
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  EMAIL_HOST: z.string().default('smtp.gmail.com'),
  EMAIL_PORT: z.coerce.number().default(587),
  EMAIL_USER: z.string().default(''),
  EMAIL_PASS: z.string().default(''),

  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  SENTRY_DSN: z.string().optional(),
  SENTRY_RELEASE: z.string().optional(),

  LOCKOUT_MAX_FAILED_ATTEMPTS: z.coerce.number().default(5),
  LOCKOUT_DURATION_MINUTES: z.coerce.number().default(30),
  LOCKOUT_FAILED_ATTEMPTS_WINDOW_MINUTES: z.coerce.number().default(15),
  LOCKOUT_PASSWORD_HISTORY_LIMIT: z.coerce.number().default(5),
});

export const config = EnvSchema.parse({
  ...process.env,
  NODE_ENV: process.env.NODE_ENV?.trim(),
});

// Helper computed values for convenience
export const corsOrigins = config.CORS_ORIGINS?.split(',') ?? [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:19006',
];

export const allowedFileTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];

export const dbMaxPoolSize =
  config.DB_MAX_POOL_SIZE ?? (config.NODE_ENV === PRODUCTION ? 20 : 5);
export const dbMinPoolSize = config.NODE_ENV === PRODUCTION ? 5 : 1;
export const dbConnTimeoutMs =
  config.DB_CONN_TIMEOUT_MS ??
  (config.NODE_ENV === PRODUCTION ? 5 * SECOND : 2 * SECOND);
