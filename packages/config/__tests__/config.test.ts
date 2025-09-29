import {
  getEnvVar,
  getEnvVarAsNumber,
  getEnvVarAsBoolean,
  buildDatabaseConfig,
  buildAPIConfig,
  buildTwilioConfig,
  buildElevenLabsConfig,
  buildAppConfig,
  validateConfig,
  isProduction,
  isDevelopment,
  isTest,
  DEFAULT_PAGINATION_LIMIT,
  MAX_PAGINATION_LIMIT,
  ORDER_STATUSES,
  PAYMENT_METHODS,
  USER_ROLES,
} from '../index';

describe('Config Package', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getEnvVar', () => {
    it('should return environment variable value', () => {
      process.env.TEST_VAR = 'test_value';
      expect(getEnvVar('TEST_VAR')).toBe('test_value');
    });

    it('should return default value when env var is not set', () => {
      expect(getEnvVar('NON_EXISTENT_VAR', 'default')).toBe('default');
    });

    it('should throw error when env var is required but not set', () => {
      expect(() => getEnvVar('REQUIRED_VAR')).toThrow(
        'Environment variable REQUIRED_VAR is required but not set'
      );
    });

    it('should return empty string as default when no default provided', () => {
      process.env.EMPTY_VAR = '';
      expect(getEnvVar('EMPTY_VAR', 'default')).toBe('default');
    });
  });

  describe('getEnvVarAsNumber', () => {
    it('should return number from environment variable', () => {
      process.env.NUM_VAR = '42';
      expect(getEnvVarAsNumber('NUM_VAR')).toBe(42);
    });

    it('should return default number when env var is not set', () => {
      expect(getEnvVarAsNumber('NON_EXISTENT_NUM', 100)).toBe(100);
    });

    it('should throw error when env var is required but not set', () => {
      expect(() => getEnvVarAsNumber('REQUIRED_NUM')).toThrow(
        'Environment variable REQUIRED_NUM is required but not set'
      );
    });

    it('should throw error when env var is not a valid number', () => {
      process.env.INVALID_NUM = 'not_a_number';
      expect(() => getEnvVarAsNumber('INVALID_NUM')).toThrow(
        'Environment variable INVALID_NUM must be a valid number'
      );
    });

    it('should handle negative numbers', () => {
      process.env.NEGATIVE_NUM = '-5';
      expect(getEnvVarAsNumber('NEGATIVE_NUM')).toBe(-5);
    });

    it('should handle zero', () => {
      process.env.ZERO_NUM = '0';
      expect(getEnvVarAsNumber('ZERO_NUM')).toBe(0);
    });
  });

  describe('getEnvVarAsBoolean', () => {
    it('should return true for \"true\" string', () => {
      process.env.BOOL_VAR = 'true';
      expect(getEnvVarAsBoolean('BOOL_VAR')).toBe(true);
    });

    it('should return true for \"TRUE\" string', () => {
      process.env.BOOL_VAR = 'TRUE';
      expect(getEnvVarAsBoolean('BOOL_VAR')).toBe(true);
    });

    it('should return false for \"false\" string', () => {
      process.env.BOOL_VAR = 'false';
      expect(getEnvVarAsBoolean('BOOL_VAR')).toBe(false);
    });

    it('should return false for any other string', () => {
      process.env.BOOL_VAR = 'anything';
      expect(getEnvVarAsBoolean('BOOL_VAR')).toBe(false);
    });

    it('should return default boolean when env var is not set', () => {
      expect(getEnvVarAsBoolean('NON_EXISTENT_BOOL', true)).toBe(true);
    });

    it('should throw error when env var is required but not set', () => {
      expect(() => getEnvVarAsBoolean('REQUIRED_BOOL')).toThrow(
        'Environment variable REQUIRED_BOOL is required but not set'
      );
    });
  });

  describe('buildDatabaseConfig', () => {
    it('should build database config with defaults', () => {
      process.env.DB_PASSWORD = 'secret';
      
      const config = buildDatabaseConfig();

      expect(config).toEqual({
        host: 'localhost',
        port: 5432,
        database: 'foodime',
        username: 'postgres',
        password: 'secret',
        ssl: false,
      });
    });

    it('should build database config with custom values', () => {
      process.env.DB_HOST = 'db.example.com';
      process.env.DB_PORT = '3306';
      process.env.DB_NAME = 'custom_db';
      process.env.DB_USER = 'admin';
      process.env.DB_PASSWORD = 'super_secret';
      process.env.DB_SSL = 'true';
      
      const config = buildDatabaseConfig();

      expect(config).toEqual({
        host: 'db.example.com',
        port: 3306,
        database: 'custom_db',
        username: 'admin',
        password: 'super_secret',
        ssl: true,
      });
    });

    it('should throw error when DB_PASSWORD is not set', () => {
      expect(() => buildDatabaseConfig()).toThrow(
        'Environment variable DB_PASSWORD is required but not set'
      );
    });
  });

  describe('buildAPIConfig', () => {
    it('should build API config with defaults', () => {
      const config = buildAPIConfig();

      expect(config).toEqual({
        baseUrl: 'http://localhost:3000',
        timeout: 30000,
        retries: 3,
        version: 'v1',
      });
    });

    it('should build API config with custom values', () => {
      process.env.API_BASE_URL = 'https://api.example.com';
      process.env.API_TIMEOUT = '5000';
      process.env.API_RETRIES = '5';
      process.env.API_VERSION = 'v2';
      
      const config = buildAPIConfig();

      expect(config).toEqual({
        baseUrl: 'https://api.example.com',
        timeout: 5000,
        retries: 5,
        version: 'v2',
      });
    });
  });

  describe('buildTwilioConfig', () => {
    it('should build Twilio config', () => {
      process.env.TWILIO_ACCOUNT_SID = 'ACtest123';
      process.env.TWILIO_AUTH_TOKEN = 'auth_token_123';
      process.env.TWILIO_PHONE_NUMBER = '+1234567890';
      
      const config = buildTwilioConfig();

      expect(config).toEqual({
        accountSid: 'ACtest123',
        authToken: 'auth_token_123',
        phoneNumber: '+1234567890',
      });
    });

    it('should throw error when required Twilio env vars are missing', () => {
      expect(() => buildTwilioConfig()).toThrow('Environment variable TWILIO_ACCOUNT_SID is required but not set');
      
      process.env.TWILIO_ACCOUNT_SID = 'ACtest123';
      expect(() => buildTwilioConfig()).toThrow('Environment variable TWILIO_AUTH_TOKEN is required but not set');
    });
  });

  describe('buildElevenLabsConfig', () => {
    it('should build ElevenLabs config with defaults', () => {
      process.env.ELEVENLABS_API_KEY = 'sk_test123';
      
      const config = buildElevenLabsConfig();

      expect(config).toEqual({
        apiKey: 'sk_test123',
        baseUrl: 'https://api.elevenlabs.io/v1',
        defaultVoice: 'EXAVITQu4vr4xnSDxMaL',
        defaultModel: 'eleven_turbo_v2',
      });
    });

    it('should build ElevenLabs config with custom values', () => {
      process.env.ELEVENLABS_API_KEY = 'sk_custom123';
      process.env.ELEVENLABS_BASE_URL = 'https://custom.api.com/v1';
      process.env.ELEVENLABS_DEFAULT_VOICE = 'custom_voice_id';
      process.env.ELEVENLABS_DEFAULT_MODEL = 'custom_model';
      
      const config = buildElevenLabsConfig();

      expect(config).toEqual({
        apiKey: 'sk_custom123',
        baseUrl: 'https://custom.api.com/v1',
        defaultVoice: 'custom_voice_id',
        defaultModel: 'custom_model',
      });
    });

    it('should throw error when ELEVENLABS_API_KEY is not set', () => {
      expect(() => buildElevenLabsConfig()).toThrow(
        'Environment variable ELEVENLABS_API_KEY is required but not set'
      );
    });
  });

  describe('buildAppConfig', () => {
    it('should build app config with defaults', () => {
      // Set NODE_ENV to development for this test since Jest sets it to 'test'
      process.env.NODE_ENV = 'development';
      
      const config = buildAppConfig();

      expect(config).toEqual({
        name: 'Foodime',
        version: '1.0.0',
        environment: 'development',
        port: 3000,
        cors: {
          origins: ['http://localhost:3000', 'http://localhost:3001'],
          credentials: true,
        },
        logging: {
          level: 'info',
          format: 'text',
        },
      });
    });

    it('should build app config with custom values', () => {
      process.env.APP_NAME = 'Custom App';
      process.env.APP_VERSION = '2.0.0';
      process.env.NODE_ENV = 'production';
      process.env.PORT = '4000';
      process.env.CORS_ORIGINS = 'https://example.com,https://app.example.com';
      process.env.CORS_CREDENTIALS = 'false';
      process.env.LOG_LEVEL = 'error';
      process.env.LOG_FORMAT = 'json';
      
      const config = buildAppConfig();

      expect(config).toEqual({
        name: 'Custom App',
        version: '2.0.0',
        environment: 'production',
        port: 4000,
        cors: {
          origins: ['https://example.com', 'https://app.example.com'],
          credentials: false,
        },
        logging: {
          level: 'error',
          format: 'json',
        },
      });
    });

    it('should throw error for invalid NODE_ENV', () => {
      process.env.NODE_ENV = 'invalid_env';
      
      expect(() => buildAppConfig()).toThrow(
        'Invalid NODE_ENV: invalid_env. Must be development, staging, or production'
      );
    });
  });

  describe('validateConfig', () => {
    it('should not throw for valid config', () => {
      const config = { name: 'test', port: 3000, enabled: true };
      
      expect(() => validateConfig(config, ['name', 'port'])).not.toThrow();
    });

    it('should throw error for missing required field', () => {
      const config = { name: 'test' };
      
      expect(() => validateConfig(config, ['name', 'port'])).toThrow(
        "Required configuration field 'port' is missing or empty"
      );
    });

    it('should throw error for empty string field', () => {
      const config = { name: '', port: 3000 };
      
      expect(() => validateConfig(config, ['name'])).toThrow(
        "Required configuration field 'name' is missing or empty"
      );
    });
  });

  describe('environment helpers', () => {
    it('should detect production environment', () => {
      process.env.NODE_ENV = 'production';
      expect(isProduction()).toBe(true);
      expect(isDevelopment()).toBe(false);
      expect(isTest()).toBe(false);
    });

    it('should detect development environment', () => {
      process.env.NODE_ENV = 'development';
      expect(isProduction()).toBe(false);
      expect(isDevelopment()).toBe(true);
      expect(isTest()).toBe(false);
    });

    it('should detect test environment', () => {
      process.env.NODE_ENV = 'test';
      expect(isProduction()).toBe(false);
      expect(isDevelopment()).toBe(false);
      expect(isTest()).toBe(true);
    });
  });

  describe('constants', () => {
    it('should export correct pagination constants', () => {
      expect(DEFAULT_PAGINATION_LIMIT).toBe(20);
      expect(MAX_PAGINATION_LIMIT).toBe(100);
    });

    it('should export order statuses', () => {
      expect(ORDER_STATUSES.PENDING).toBe('pending');
      expect(ORDER_STATUSES.CONFIRMED).toBe('confirmed');
      expect(ORDER_STATUSES.PREPARING).toBe('preparing');
      expect(ORDER_STATUSES.READY).toBe('ready');
      expect(ORDER_STATUSES.DELIVERED).toBe('delivered');
      expect(ORDER_STATUSES.CANCELLED).toBe('cancelled');
    });

    it('should export payment methods', () => {
      expect(PAYMENT_METHODS.CASH).toBe('cash');
      expect(PAYMENT_METHODS.CREDIT_CARD).toBe('credit_card');
      expect(PAYMENT_METHODS.DEBIT_CARD).toBe('debit_card');
      expect(PAYMENT_METHODS.DIGITAL_WALLET).toBe('digital_wallet');
    });

    it('should export user roles', () => {
      expect(USER_ROLES.CUSTOMER).toBe('customer');
      expect(USER_ROLES.RESTAURANT_OWNER).toBe('restaurant_owner');
      expect(USER_ROLES.DELIVERY_DRIVER).toBe('delivery_driver');
      expect(USER_ROLES.ADMIN).toBe('admin');
    });
  });

  describe('default export', () => {
    it('should export all functions and constants in default object', () => {
      const defaultExport = require('../index').default;
      
      expect(typeof defaultExport.buildDatabaseConfig).toBe('function');
      expect(typeof defaultExport.buildAPIConfig).toBe('function');
      expect(typeof defaultExport.buildTwilioConfig).toBe('function');
      expect(typeof defaultExport.buildElevenLabsConfig).toBe('function');
      expect(typeof defaultExport.buildAppConfig).toBe('function');
      expect(typeof defaultExport.getEnvVar).toBe('function');
      expect(typeof defaultExport.getEnvVarAsNumber).toBe('function');
      expect(typeof defaultExport.getEnvVarAsBoolean).toBe('function');
      expect(typeof defaultExport.validateConfig).toBe('function');
      expect(typeof defaultExport.isProduction).toBe('function');
      expect(typeof defaultExport.isDevelopment).toBe('function');
      expect(typeof defaultExport.isTest).toBe('function');
      expect(defaultExport.DEFAULT_PAGINATION_LIMIT).toBe(20);
      expect(defaultExport.ORDER_STATUSES).toBeDefined();
      expect(defaultExport.PAYMENT_METHODS).toBeDefined();
      expect(defaultExport.USER_ROLES).toBeDefined();
    });
  });
});
