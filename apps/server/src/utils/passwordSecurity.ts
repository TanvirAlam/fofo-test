import bcrypt from 'bcryptjs';
import { RedisService } from '../services/RedisService';
import { logger } from './logger';
import { config } from '../config';
import { MINUTE, REGEX } from './constant';

export const validatePassword = (password: string): boolean => {
  return REGEX.PASSWORD.test(password);
};

export const getPasswordValidationErrors = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!REGEX.LOWERCASE.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!REGEX.UPPERCASE.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!REGEX.NUMBER.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!REGEX.SPECIAL.test(password)) {
    errors.push(
      'Password must contain at least one special character (@$!%*?&)'
    );
  }

  return errors;
};

export const checkPasswordHistory = async (
  newPassword: string,
  passwordHistory: string[]
): Promise<boolean> => {
  for (const hashedPassword of passwordHistory) {
    const isMatch = await bcrypt.compare(newPassword, hashedPassword);
    if (isMatch) {
      return true;
    }
  }
  return false;
};

// Helper functions for Redis keys
const getFailedAttemptsKey = (email: string): string =>
  `auth:failed_attempts:${email}`;
const getLockoutKey = (email: string): string => `auth:lockout:${email}`;

export const incrementFailedAttempts = async (
  email: string
): Promise<number> => {
  const redisService = RedisService.getInstance();

  if (!redisService.isRedisConnected()) {
    logger.warn('Redis not connected, cannot track failed attempts');
    return 1;
  }

  const attemptsKey = getFailedAttemptsKey(email);

  try {
    const attempts = await redisService.getClient()?.incr(attemptsKey);

    // Set expiry on first attempt
    if (attempts === 1) {
      await redisService
        .getClient()
        ?.expire(
          attemptsKey,
          config.LOCKOUT_FAILED_ATTEMPTS_WINDOW_MINUTES * MINUTE
        );
    }

    // Lock account if max attempts reached
    if (attempts && attempts >= config.LOCKOUT_MAX_FAILED_ATTEMPTS) {
      const lockoutKey = getLockoutKey(email);
      await redisService
        .getClient()
        ?.setex(lockoutKey, config.LOCKOUT_DURATION_MINUTES * MINUTE, 'locked');
      logger.info(`Account locked for email: ${email}`);
    }

    return attempts ?? 0;
  } catch (error) {
    logger.error('Error incrementing failed attempts:', error);
    return 1;
  }
};

export const isAccountLocked = async (email: string): Promise<boolean> => {
  const redisService = RedisService.getInstance();

  if (!redisService.isRedisConnected()) {
    return false;
  }

  try {
    const lockoutKey = getLockoutKey(email);
    const exists = await redisService.getClient()?.exists(lockoutKey);
    return exists === 1;
  } catch (error) {
    return false;
  }
};

export const getRemainingLockoutTime = async (
  email: string
): Promise<number> => {
  const redisService = RedisService.getInstance();

  if (!redisService.isRedisConnected()) {
    return 0;
  }

  try {
    const lockoutKey = getLockoutKey(email);
    const ttl = await redisService.getClient()?.ttl(lockoutKey);
    return ttl && ttl > 0 ? Math.ceil(ttl / MINUTE) : 0;
  } catch (error) {
    return 0;
  }
};

export const resetFailedAttempts = async (email: string): Promise<void> => {
  const redisService = RedisService.getInstance();

  if (!redisService.isRedisConnected()) {
    return;
  }

  try {
    const failedAttemptsKey = getFailedAttemptsKey(email);
    const lockoutKey = getLockoutKey(email);

    await Promise.all([
      redisService.getClient()?.del(failedAttemptsKey),
      redisService.getClient()?.del(lockoutKey),
    ]);
  } catch (error) {
    logger.error('Error resetting failed attempts:', error);
  }
};
