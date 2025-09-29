// This test file doesn't import setup to avoid database connection issues

describe('Jest Setup', () => {
  it('should run tests successfully', () => {
    expect(true).toBe(true);
  });

  it('should handle basic TypeScript', () => {
    const greeting = (name: string): string => {
      return `Hello, ${name}!`;
    };

    expect(greeting('Jest')).toBe('Hello, Jest!');
  });

  it('should handle async operations', async () => {
    const asyncOperation = async (): Promise<string> => {
      return new Promise(resolve => {
        setTimeout(() => resolve('completed'), 10);
      });
    };

    const result = await asyncOperation();
    expect(result).toBe('completed');
  });
});

describe('Environment Variables', () => {
  beforeAll(() => {
    // Set test environment variables for this test
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
  });

  it('should have test environment set', () => {
    expect(process.env.NODE_ENV).toBe('test');
  });

  it('should have JWT secret configured', () => {
    expect(process.env.JWT_SECRET).toBeDefined();
    expect(process.env.JWT_SECRET).toBe('test-jwt-secret-key-for-testing-only');
  });
});
