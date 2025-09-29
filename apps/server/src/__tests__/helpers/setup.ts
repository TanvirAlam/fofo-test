import 'reflect-metadata';
import { Pool } from 'pg';
import { logger } from '../../utils/logger';

// Ensure reflect-metadata is imported first before any TypeGraphQL entities
require('reflect-metadata');

// Test database configuration
const TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5432/foodime_test_db';

// Global test database pool
export let testDb: Pool;

// Setup before all tests
beforeAll(async () => {
  // Skip database setup for smoke tests
  if (process.env.JEST_SMOKE_TEST) {
    return;
  }

  // Create test database connection
  testDb = new Pool({
    connectionString: TEST_DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  try {
    // Test connection only if database URL is properly configured
    if (TEST_DATABASE_URL && !TEST_DATABASE_URL.includes('username:password')) {
      const client = await testDb.connect();
      await client.query('SELECT 1');
      client.release();

      logger.info('Test database connected successfully');
    } else {
      logger.warn(
        'Test database URL contains placeholder values - skipping connection test'
      );
    }
  } catch (error) {
    logger.warn('Test database connection failed:', error);
    // Don't throw error to allow tests that don't need database to run
  }
});

// Cleanup after all tests
afterAll(async () => {
  if (testDb) {
    await testDb.end();
    logger.info('Test database connection closed');
  }
});

// Clean up database before each test
beforeEach(async () => {
  // Skip database cleanup for smoke tests or if database is not available
  if (process.env.JEST_SMOKE_TEST || !testDb) {
    return;
  }

  try {
    // Clean up tables in reverse dependency order
    const tables = [
      'ai_chat_messages',
      'ai_chats',
      'order_items',
      'orders',
      'reviews',
      'favorites',
      'addresses',
      'notifications',
      'menu_items',
      'menu_categories',
      'restaurants',
      'sessions',
      'rflct_codes',
      'users',
      'api_logs',
      'system_events',
    ];

    for (const table of tables) {
      await testDb.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
    }
  } catch (error) {
    // Skip cleanup if database operations fail
    logger.warn('Database cleanup failed, skipping:', error);
  }
});

// Helper function to create test data
export const createTestUser = async (overrides: any = {}) => {
  if (process.env.JEST_SMOKE_TEST || !testDb) {
    throw new Error('Test database not available');
  }

  const defaultUser = {
    email: 'test@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2r8V3O6.1i', // 'password'
    firstName: 'Test',
    lastName: 'User',
    role: 'USER',
    isActive: true,
    isVerified: true,
    ...overrides,
  };

  const query = `
    INSERT INTO users (email, password, first_name, last_name, role, is_active, is_verified)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id, email, first_name as "firstName", last_name as "lastName", role, 
              is_active as "isActive", is_verified as "isVerified", 
              created_at as "createdAt", updated_at as "updatedAt"
  `;

  const result = await testDb.query(query, [
    defaultUser.email,
    defaultUser.password,
    defaultUser.firstName,
    defaultUser.lastName,
    defaultUser.role,
    defaultUser.isActive,
    defaultUser.isVerified,
  ]);

  return result.rows[0];
};

// Helper function to create test RFLCT code
export const createTestRFLCTCode = async (overrides: any = {}) => {
  if (process.env.JEST_SMOKE_TEST || !testDb) {
    throw new Error('Test database not available');
  }

  const defaultCode = {
    code: '1234',
    type: 'USER_ACCESS',
    description: 'Test RFLCT code',
    isActive: true,
    userId: null,
    usageCount: 0,
    ...overrides,
  };

  const query = `
    INSERT INTO rflct_codes (code, type, description, is_active, user_id, usage_count)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, code, type, description, is_active as "isActive", user_id as "userId",
              usage_count as "usageCount", last_used as "lastUsed", metadata,
              created_at as "createdAt", updated_at as "updatedAt"
  `;

  const result = await testDb.query(query, [
    defaultCode.code,
    defaultCode.type,
    defaultCode.description,
    defaultCode.isActive,
    defaultCode.userId,
    defaultCode.usageCount,
  ]);

  return result.rows[0];
};

// Helper function to create test restaurant
export const createTestRestaurant = async (overrides: any = {}) => {
  if (process.env.JEST_SMOKE_TEST || !testDb) {
    throw new Error('Test database not available');
  }

  const defaultRestaurant = {
    name: 'Test Restaurant',
    description: 'A test restaurant',
    address: '123 Test Street',
    city: 'Test City',
    state: 'Test State',
    zipCode: '12345',
    isActive: true,
    rating: 4.5,
    totalReviews: 10,
    ...overrides,
  };

  const query = `
    INSERT INTO restaurants (name, description, address, city, state, zip_code, is_active, rating, total_reviews)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id, name, description, address, city, state, zip_code as "zipCode",
              is_active as "isActive", rating, total_reviews as "totalReviews",
              created_at as "createdAt", updated_at as "updatedAt"
  `;

  const result = await testDb.query(query, [
    defaultRestaurant.name,
    defaultRestaurant.description,
    defaultRestaurant.address,
    defaultRestaurant.city,
    defaultRestaurant.state,
    defaultRestaurant.zipCode,
    defaultRestaurant.isActive,
    defaultRestaurant.rating,
    defaultRestaurant.totalReviews,
  ]);

  return result.rows[0];
};

// Mock logger for tests to reduce noise
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.DATABASE_URL = TEST_DATABASE_URL;
