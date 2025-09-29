import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../../graphql/entities/User';

// JWT token generation for testing
export const TEST_JWT_SECRET = 'test-jwt-secret-key-for-testing-only';

export const generateTestToken = (
  userId: string,
  email: string,
  role: string = 'USER'
) => {
  return jwt.sign({ userId, email, role }, TEST_JWT_SECRET, {
    expiresIn: '1h',
  });
};

// Generate expired token helper
export const generateExpiredToken = (user: any): string => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, TEST_JWT_SECRET, { expiresIn: '0s' });
};

// Generate invalid token helper
export const generateInvalidToken = (): string => {
  return 'invalid.token.here';
};

// Password hashing for testing
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

// Mock user data generator
export const generateMockUser = (
  overrides: Partial<User> = {}
): Partial<User> => {
  return {
    id: 'test-user-id-123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'USER' as any,
    isActive: true,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

// Mock RFLCT code generator
export const generateMockRFLCTCode = (overrides: any = {}) => {
  return {
    id: 'test-rflct-id-123',
    code: '1234',
    type: 'USER_ACCESS',
    description: 'Test RFLCT code',
    isActive: true,
    userId: null,
    usageCount: 0,
    lastUsed: null,
    metadata: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

// Mock restaurant generator
export const generateMockRestaurant = (overrides: any = {}) => {
  return {
    id: 'test-restaurant-id-123',
    name: 'Test Restaurant',
    description: 'A test restaurant',
    address: '123 Test Street',
    city: 'Test City',
    state: 'Test State',
    zipCode: '12345',
    isActive: true,
    rating: 4.5,
    totalReviews: 10,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

// GraphQL query helper
export const createGraphQLQuery = (query: string, variables?: any) => {
  return {
    query,
    variables,
  };
};

// Common GraphQL mutations
export const REGISTER_MUTATION = `
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        email
        firstName
        lastName
        role
        createdAt
      }
      token
    }
  }
`;

export const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        firstName
        lastName
        role
      }
      token
    }
  }
`;

export const CREATE_RFLCT_CODE_MUTATION = `
  mutation CreateRFLCTCode($input: CreateRFLCTCodeInput!) {
    createRFLCTCode(input: $input) {
      id
      code
      type
      description
      isActive
      usageCount
      createdAt
    }
  }
`;

export const USE_RFLCT_CODE_MUTATION = `
  mutation UseRFLCTCode($code: String!) {
    useRFLCTCode(code: $code) {
      id
      code
      type
      usageCount
      lastUsed
    }
  }
`;

// Common GraphQL queries
export const ME_QUERY = `
  query Me {
    me {
      id
      email
      firstName
      lastName
      role
      isActive
      isVerified
    }
  }
`;

export const USERS_QUERY = `
  query Users($limit: Float, $offset: Float) {
    users(limit: $limit, offset: $offset) {
      id
      email
      firstName
      lastName
      role
      isActive
      createdAt
    }
  }
`;

export const RFLCT_CODES_QUERY = `
  query RFLCTCodes($limit: Float, $offset: Float, $isActive: Boolean) {
    rflctCodes(limit: $limit, offset: $offset, isActive: $isActive) {
      id
      code
      type
      description
      isActive
      usageCount
      createdAt
    }
  }
`;

// Test data validation helpers
export const validateUserResponse = (user: any) => {
  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('email');
  expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  expect(user).toHaveProperty('role');
  expect(['USER', 'ADMIN', 'SUPER_ADMIN', 'RESTAURANT_OWNER']).toContain(
    user.role
  );
};

export const validateRFLCTCodeResponse = (code: any) => {
  expect(code).toHaveProperty('id');
  expect(code).toHaveProperty('code');
  expect(code.code).toMatch(/^\d{4}$/); // 4-digit validation
  expect(code).toHaveProperty('type');
  expect([
    'USER_ACCESS',
    'FEATURE_UNLOCK',
    'PROMOTION',
    'SPECIAL_ACTION',
    'SYSTEM_COMMAND',
  ]).toContain(code.type);
  expect(code).toHaveProperty('isActive');
  expect(typeof code.isActive).toBe('boolean');
  expect(code).toHaveProperty('usageCount');
  expect(typeof code.usageCount).toBe('number');
};

// Error message constants
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'User already exists with this email',
  RFLCT_CODE_NOT_FOUND: 'RFLCT code not found',
  RFLCT_CODE_ALREADY_EXISTS: 'RFLCT code already exists',
  RFLCT_CODE_INACTIVE: 'RFLCT code is inactive',
  INVALID_4_DIGIT_CODE: 'RFLCT code must be exactly 4 digits',
  AUTHENTICATION_REQUIRED: 'Authentication required',
  INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;
