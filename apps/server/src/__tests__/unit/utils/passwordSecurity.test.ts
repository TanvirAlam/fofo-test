import bcrypt from 'bcryptjs';
import {
  validatePassword,
  getPasswordValidationErrors,
  checkPasswordHistory,
  incrementFailedAttempts,
  isAccountLocked,
  getRemainingLockoutTime,
  resetFailedAttempts,
} from '../../../utils/passwordSecurity';
import { RedisService } from '../../../services/RedisService';

// Mock dependencies
jest.mock('../../../services/RedisService');
jest.mock('../../../utils/logger');
jest.mock('../../../config', () => ({
  config: {
    LOCKOUT_MAX_FAILED_ATTEMPTS: 5,
    LOCKOUT_DURATION_MINUTES: 30,
    LOCKOUT_FAILED_ATTEMPTS_WINDOW_MINUTES: 15,
  },
}));

const MockRedisService = RedisService as jest.MockedClass<typeof RedisService>;

describe('Password Security Utils', () => {
  let mockRedisClient: any;
  let mockRedisService: any;

  beforeEach(() => {
    mockRedisClient = {
      incr: jest.fn(),
      expire: jest.fn(),
      setex: jest.fn(),
      exists: jest.fn(),
      ttl: jest.fn(),
      del: jest.fn(),
    };

    mockRedisService = {
      isRedisConnected: jest.fn().mockReturnValue(true),
      getClient: jest.fn().mockReturnValue(mockRedisClient),
    };

    MockRedisService.getInstance = jest.fn().mockReturnValue(mockRedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validatePassword', () => {
    it('should return true for valid strong password', () => {
      const validPassword = 'StrongPass123!';
      expect(validatePassword(validPassword)).toBe(true);
    });

    it('should return false for password without uppercase letter', () => {
      const weakPassword = 'weakpass123!';
      expect(validatePassword(weakPassword)).toBe(false);
    });

    it('should return false for password without lowercase letter', () => {
      const weakPassword = 'STRONGPASS123!';
      expect(validatePassword(weakPassword)).toBe(false);
    });

    it('should return false for password without number', () => {
      const weakPassword = 'StrongPass!';
      expect(validatePassword(weakPassword)).toBe(false);
    });

    it('should return false for password without special character', () => {
      const weakPassword = 'StrongPass123';
      expect(validatePassword(weakPassword)).toBe(false);
    });

    it('should return false for password shorter than 8 characters', () => {
      const shortPassword = 'Str1!';
      expect(validatePassword(shortPassword)).toBe(false);
    });

    it('should return true for password with all required characters', () => {
      const validPasswords = [
        'Password123!',
        'MyStr0ng@Pass',
        'Complex$Pass1',
        'S3cur3&Strong',
      ];

      validPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(true);
      });
    });
  });

  describe('getPasswordValidationErrors', () => {
    it('should return empty array for valid password', () => {
      const validPassword = 'StrongPass123!';
      const errors = getPasswordValidationErrors(validPassword);
      expect(errors).toEqual([]);
    });

    it('should return appropriate error for short password', () => {
      const shortPassword = 'Short1!';
      const errors = getPasswordValidationErrors(shortPassword);
      expect(errors).toContain('Password must be at least 8 characters long');
    });

    it('should return appropriate error for missing lowercase', () => {
      const password = 'STRONGPASS123!';
      const errors = getPasswordValidationErrors(password);
      expect(errors).toContain(
        'Password must contain at least one lowercase letter'
      );
    });

    it('should return appropriate error for missing uppercase', () => {
      const password = 'strongpass123!';
      const errors = getPasswordValidationErrors(password);
      expect(errors).toContain(
        'Password must contain at least one uppercase letter'
      );
    });

    it('should return appropriate error for missing number', () => {
      const password = 'StrongPass!';
      const errors = getPasswordValidationErrors(password);
      expect(errors).toContain('Password must contain at least one number');
    });

    it('should return appropriate error for missing special character', () => {
      const password = 'StrongPass123';
      const errors = getPasswordValidationErrors(password);
      expect(errors).toContain(
        'Password must contain at least one special character (@$!%*?&)'
      );
    });

    it('should return multiple errors for invalid password', () => {
      const weakPassword = 'weak';
      const errors = getPasswordValidationErrors(weakPassword);

      expect(errors).toContain('Password must be at least 8 characters long');
      expect(errors).toContain(
        'Password must contain at least one uppercase letter'
      );
      expect(errors).toContain('Password must contain at least one number');
      expect(errors).toContain(
        'Password must contain at least one special character (@$!%*?&)'
      );
      expect(errors.length).toBe(4);
    });
  });

  describe('checkPasswordHistory', () => {
    it('should return false for new password not in history', async () => {
      const newPassword = 'NewPassword123!';
      const hashedPassword1 = await bcrypt.hash('OldPassword123!', 12);
      const hashedPassword2 = await bcrypt.hash('AnotherOld123!', 12);
      const passwordHistory = [hashedPassword1, hashedPassword2];

      const result = await checkPasswordHistory(newPassword, passwordHistory);
      expect(result).toBe(false);
    });

    it('should return true for password that exists in history', async () => {
      const password = 'ExistingPassword123!';
      const hashedPassword = await bcrypt.hash(password, 12);
      const passwordHistory = [hashedPassword];

      const result = await checkPasswordHistory(password, passwordHistory);
      expect(result).toBe(true);
    });

    it('should return false for empty password history', async () => {
      const password = 'AnyPassword123!';
      const result = await checkPasswordHistory(password, []);
      expect(result).toBe(false);
    });

    it('should handle multiple passwords in history correctly', async () => {
      const testPassword = 'TestPassword123!';
      const otherPasswords = ['Other1!', 'Other2!', 'Other3!'];

      const hashedOthers = await Promise.all(
        otherPasswords.map(pwd => bcrypt.hash(pwd, 12))
      );
      const hashedTest = await bcrypt.hash(testPassword, 12);

      // Test password not in history
      let result = await checkPasswordHistory(testPassword, hashedOthers);
      expect(result).toBe(false);

      // Test password in history
      result = await checkPasswordHistory(testPassword, [
        ...hashedOthers,
        hashedTest,
      ]);
      expect(result).toBe(true);
    });
  });

  describe('incrementFailedAttempts', () => {
    const testEmail = 'test@example.com';

    it('should increment failed attempts and return count', async () => {
      mockRedisClient.incr.mockResolvedValue(1);
      mockRedisClient.expire.mockResolvedValue(true);

      const result = await incrementFailedAttempts(testEmail);

      expect(mockRedisClient.incr).toHaveBeenCalledWith(
        'auth:failed_attempts:test@example.com'
      );
      expect(mockRedisClient.expire).toHaveBeenCalledWith(
        'auth:failed_attempts:test@example.com',
        900000
      ); // 15 minutes in milliseconds
      expect(result).toBe(1);
    });

    it('should set expiry only on first attempt', async () => {
      mockRedisClient.incr.mockResolvedValue(2);

      const result = await incrementFailedAttempts(testEmail);

      expect(mockRedisClient.incr).toHaveBeenCalled();
      expect(mockRedisClient.expire).not.toHaveBeenCalled(); // No expire for 2nd attempt
      expect(result).toBe(2);
    });

    it('should lock account when max attempts reached', async () => {
      mockRedisClient.incr.mockResolvedValue(5); // Max attempts
      mockRedisClient.setex.mockResolvedValue('OK');

      const result = await incrementFailedAttempts(testEmail);

      expect(mockRedisClient.setex).toHaveBeenCalledWith(
        'auth:lockout:test@example.com',
        1800000, // 30 minutes in milliseconds
        'locked'
      );
      expect(result).toBe(5);
    });

    it('should handle Redis connection failure gracefully', async () => {
      mockRedisService.isRedisConnected.mockReturnValue(false);

      const result = await incrementFailedAttempts(testEmail);

      expect(result).toBe(1);
      expect(mockRedisClient.incr).not.toHaveBeenCalled();
    });

    it('should handle Redis errors gracefully', async () => {
      mockRedisClient.incr.mockRejectedValue(
        new Error('Redis connection failed')
      );

      const result = await incrementFailedAttempts(testEmail);

      expect(result).toBe(1);
    });
  });

  describe('isAccountLocked', () => {
    const testEmail = 'test@example.com';

    it('should return true for locked account', async () => {
      mockRedisClient.exists.mockResolvedValue(1);

      const result = await isAccountLocked(testEmail);

      expect(mockRedisClient.exists).toHaveBeenCalledWith(
        'auth:lockout:test@example.com'
      );
      expect(result).toBe(true);
    });

    it('should return false for unlocked account', async () => {
      mockRedisClient.exists.mockResolvedValue(0);

      const result = await isAccountLocked(testEmail);

      expect(result).toBe(false);
    });

    it('should return false when Redis is not connected', async () => {
      mockRedisService.isRedisConnected.mockReturnValue(false);

      const result = await isAccountLocked(testEmail);

      expect(result).toBe(false);
      expect(mockRedisClient.exists).not.toHaveBeenCalled();
    });

    it('should return false on Redis error', async () => {
      mockRedisClient.exists.mockRejectedValue(new Error('Redis error'));

      const result = await isAccountLocked(testEmail);

      expect(result).toBe(false);
    });
  });

  describe('getRemainingLockoutTime', () => {
    const testEmail = 'test@example.com';

    it('should return remaining time in minutes', async () => {
      mockRedisClient.ttl.mockResolvedValue(1800); // 30 minutes in seconds

      const result = await getRemainingLockoutTime(testEmail);

      expect(mockRedisClient.ttl).toHaveBeenCalledWith(
        'auth:lockout:test@example.com'
      );
      expect(result).toBe(1); // 1800 seconds / 60000ms = 0.03 rounded up = 1 minute
    });

    it('should return 0 for expired lockout', async () => {
      mockRedisClient.ttl.mockResolvedValue(-1);

      const result = await getRemainingLockoutTime(testEmail);

      expect(result).toBe(0);
    });

    it('should return 0 when Redis is not connected', async () => {
      mockRedisService.isRedisConnected.mockReturnValue(false);

      const result = await getRemainingLockoutTime(testEmail);

      expect(result).toBe(0);
      expect(mockRedisClient.ttl).not.toHaveBeenCalled();
    });

    it('should handle fractional minutes correctly', async () => {
      mockRedisClient.ttl.mockResolvedValue(150); // 2.5 minutes

      const result = await getRemainingLockoutTime(testEmail);

      expect(result).toBe(1); // Math.ceil(150 / 60000) = 1
    });

    it('should return 0 on Redis error', async () => {
      mockRedisClient.ttl.mockRejectedValue(new Error('Redis error'));

      const result = await getRemainingLockoutTime(testEmail);

      expect(result).toBe(0);
    });
  });

  describe('resetFailedAttempts', () => {
    const testEmail = 'test@example.com';

    it('should delete both failed attempts and lockout keys', async () => {
      mockRedisClient.del.mockResolvedValue(1);

      await resetFailedAttempts(testEmail);

      expect(mockRedisClient.del).toHaveBeenCalledTimes(2);
      expect(mockRedisClient.del).toHaveBeenCalledWith(
        'auth:failed_attempts:test@example.com'
      );
      expect(mockRedisClient.del).toHaveBeenCalledWith(
        'auth:lockout:test@example.com'
      );
    });

    it('should do nothing when Redis is not connected', async () => {
      mockRedisService.isRedisConnected.mockReturnValue(false);

      await resetFailedAttempts(testEmail);

      expect(mockRedisClient.del).not.toHaveBeenCalled();
    });

    it('should handle Redis errors gracefully', async () => {
      mockRedisClient.del.mockRejectedValue(new Error('Redis error'));

      await expect(resetFailedAttempts(testEmail)).resolves.not.toThrow();
    });

    it('should handle partial failures gracefully', async () => {
      mockRedisClient.del
        .mockResolvedValueOnce(1) // First del succeeds
        .mockRejectedValueOnce(new Error('Second del fails')); // Second del fails

      await expect(resetFailedAttempts(testEmail)).resolves.not.toThrow();
    });
  });
});
