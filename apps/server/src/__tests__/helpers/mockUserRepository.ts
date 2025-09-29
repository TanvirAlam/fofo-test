// Mock UserRepository to avoid TypeGraphQL issues in tests
export class MockUserRepository {
  findById = jest.fn();
  findByEmail = jest.fn();
  create = jest.fn();
  update = jest.fn();
  updatePassword = jest.fn();
  delete = jest.fn();
}

// Mock user type without TypeGraphQL decorators
export interface MockUser {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  password?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Export factory function for creating mock users
export const createMockUser = (overrides: Partial<MockUser> = {}): MockUser => {
  return {
    id: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    firstName: 'Test',
    lastName: 'User',
    role: 'USER',
    isActive: true,
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};
