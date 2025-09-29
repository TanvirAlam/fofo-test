import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { config } from '../config';
import redisService from '../services/RedisService';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

export const createLimiter = (
  windowMs: number,
  max: number,
  message?: string,
  skipPaths?: string[]
) => {
  const defaultSkipPaths = ['/health', '/favicon.ico'];
  const allSkipPaths = [...defaultSkipPaths, ...(skipPaths || [])];

  const options: {
    windowMs: number;
    max: number;
    message: string;
    standardHeaders: boolean;
    legacyHeaders: boolean;
    skip: (req: { path: string }) => boolean;
    store?: RedisStore;
  } = {
    windowMs,
    max,
    message: message || 'Too many requests. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: { path: string }) =>
      allSkipPaths.includes(req.path) || req.path.startsWith('/public/'),
  };

  if (redisService.isRedisConnected()) {
    try {
      const sendCommand = redisService.createSendCommand();
      if (sendCommand) {
        options.store = new RedisStore({
          sendCommand,
          prefix: 'rl:',
        });
      }
    } catch (error) {
      console.warn(
        'Failed to create Redis store, falling back to memory store:',
        error
      );
    }
  }

  return rateLimit(options);
};

export const createProgressiveLimiter = (
  windowMs: number,
  max: number,
  delayAfter?: number,
  delayMs?: number
) => {
  const limiter = createLimiter(windowMs, max);

  const delayMiddleware = (req: any, res: any, next: any) => {
    if (!delayAfter || !delayMs) return next();
    const remaining = (req as any).rateLimit?.remaining ?? max;
    const attempts = max - remaining;
    const extraAttempts = attempts - delayAfter;
    if (extraAttempts > 0) {
      const delay = Math.min(delayMs * Math.pow(2, extraAttempts), 10000);
      return setTimeout(next, delay);
    }
    return next();
  };

  return [limiter, delayMiddleware];
};

export const apiLimiter = createLimiter(MINUTE * 15, 100);
export const authLimiter = createProgressiveLimiter(HOUR, 15, 10, 1000);
export const graphqlLimiter = createLimiter(MINUTE, 100);
export const strictLimiter = createLimiter(HOUR, 10);
export const uploadLimiter = createLimiter(HOUR, 20);

export const basicRateLimiter = createLimiter(
  config.RATE_LIMIT_WINDOW,
  config.RATE_LIMIT_MAX,
  undefined,
  ['/graphql']
);

export const passwordChangeLimiter = createLimiter(
  HOUR,
  3,
  'Too many password change attempts. Please try again later.'
);

export const suspiciousActivityLimiter = createLimiter(
  HOUR * 24,
  50,
  'Suspicious activity detected. Account temporarily restricted.'
);
