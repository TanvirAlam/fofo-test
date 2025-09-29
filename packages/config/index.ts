/**
 * Configuration utilities and constants for Foodime application
 */

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

export interface APIConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  version: string;
}

export interface TwilioConfig {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

export interface ElevenLabsConfig {
  apiKey: string;
  baseUrl: string;
  defaultVoice: string;
  defaultModel: string;
}

export interface AppConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  port: number;
  cors: {
    origins: string[];
    credentials: boolean;
  };
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    format: 'json' | 'text';
  };
}

// Environment variable helpers
export function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value || defaultValue || '';
}

export function getEnvVarAsNumber(name: string, defaultValue?: number): number {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  const numValue = value ? parseInt(value, 10) : defaultValue;
  if (numValue === undefined || isNaN(numValue)) {
    throw new Error(`Environment variable ${name} must be a valid number`);
  }
  return numValue;
}

export function getEnvVarAsBoolean(name: string, defaultValue?: boolean): boolean {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  if (!value) return defaultValue || false;
  return value.toLowerCase() === 'true';
}

// Configuration builders
export function buildDatabaseConfig(): DatabaseConfig {
  return {
    host: getEnvVar('DB_HOST', 'localhost'),
    port: getEnvVarAsNumber('DB_PORT', 5432),
    database: getEnvVar('DB_NAME', 'foodime'),
    username: getEnvVar('DB_USER', 'postgres'),
    password: getEnvVar('DB_PASSWORD'),
    ssl: getEnvVarAsBoolean('DB_SSL', false),
  };
}

export function buildAPIConfig(): APIConfig {
  return {
    baseUrl: getEnvVar('API_BASE_URL', 'http://localhost:3000'),
    timeout: getEnvVarAsNumber('API_TIMEOUT', 30000),
    retries: getEnvVarAsNumber('API_RETRIES', 3),
    version: getEnvVar('API_VERSION', 'v1'),
  };
}

export function buildTwilioConfig(): TwilioConfig {
  return {
    accountSid: getEnvVar('TWILIO_ACCOUNT_SID'),
    authToken: getEnvVar('TWILIO_AUTH_TOKEN'),
    phoneNumber: getEnvVar('TWILIO_PHONE_NUMBER'),
  };
}

export function buildElevenLabsConfig(): ElevenLabsConfig {
  return {
    apiKey: getEnvVar('ELEVENLABS_API_KEY'),
    baseUrl: getEnvVar('ELEVENLABS_BASE_URL', 'https://api.elevenlabs.io/v1'),
    defaultVoice: getEnvVar('ELEVENLABS_DEFAULT_VOICE', 'EXAVITQu4vr4xnSDxMaL'),
    defaultModel: getEnvVar('ELEVENLABS_DEFAULT_MODEL', 'eleven_turbo_v2'),
  };
}

export function buildAppConfig(): AppConfig {
  const env = getEnvVar('NODE_ENV', 'development');
  if (!['development', 'staging', 'production'].includes(env)) {
    throw new Error(`Invalid NODE_ENV: ${env}. Must be development, staging, or production`);
  }

  return {
    name: getEnvVar('APP_NAME', 'Foodime'),
    version: getEnvVar('APP_VERSION', '1.0.0'),
    environment: env as 'development' | 'staging' | 'production',
    port: getEnvVarAsNumber('PORT', 3000),
    cors: {
      origins: getEnvVar('CORS_ORIGINS', 'http://localhost:3000,http://localhost:3001').split(','),
      credentials: getEnvVarAsBoolean('CORS_CREDENTIALS', true),
    },
    logging: {
      level: (getEnvVar('LOG_LEVEL', 'info') as 'debug' | 'info' | 'warn' | 'error'),
      format: (getEnvVar('LOG_FORMAT', 'text') as 'json' | 'text'),
    },
  };
}

// Constants
export const DEFAULT_PAGINATION_LIMIT = 20;
export const MAX_PAGINATION_LIMIT = 100;

export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  DIGITAL_WALLET: 'digital_wallet',
} as const;

export const USER_ROLES = {
  CUSTOMER: 'customer',
  RESTAURANT_OWNER: 'restaurant_owner',
  DELIVERY_DRIVER: 'delivery_driver',
  ADMIN: 'admin',
} as const;

// Validation helpers
export function validateConfig<T>(config: T, requiredFields: (keyof T)[]): void {
  for (const field of requiredFields) {
    if (!config[field]) {
      throw new Error(`Required configuration field '${String(field)}' is missing or empty`);
    }
  }
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

// Default export with all configurations
export default {
  buildDatabaseConfig,
  buildAPIConfig,
  buildTwilioConfig,
  buildElevenLabsConfig,
  buildAppConfig,
  getEnvVar,
  getEnvVarAsNumber,
  getEnvVarAsBoolean,
  validateConfig,
  isProduction,
  isDevelopment,
  isTest,
  DEFAULT_PAGINATION_LIMIT,
  MAX_PAGINATION_LIMIT,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  USER_ROLES,
};
