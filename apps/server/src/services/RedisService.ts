import Redis from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/logger';
import type { SendCommandFn, RedisReply } from 'rate-limit-redis';

export class RedisService {
  private static instance: RedisService;
  private redis: Redis | null = null;
  private isConnected = false;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  private initialize(): void {
    const redisUrl = config.REDIS_URL;

    try {
      this.redis = new Redis(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        enableReadyCheck: false,
      });

      this.setupEventHandlers();
    } catch (error) {
      logger.warn('Failed to initialize Redis, using fallback mode', { error });
      this.redis = null;
    }
  }

  private setupEventHandlers(): void {
    if (!this.redis) return;

    this.redis.on('connect', () => {
      this.isConnected = true;
      logger.info('✅ Redis connected successfully');
    });

    this.redis.on('error', error => {
      this.isConnected = false;
      logger.warn('⚠️ Redis connection error, falling back to memory store', {
        error: error.message,
      });
    });

    this.redis.on('close', () => {
      this.isConnected = false;
      logger.info('📴 Redis connection closed');
    });

    this.redis.on('reconnecting', () => {
      logger.info('🔄 Redis reconnecting...');
    });
  }

  public getClient(): Redis | null {
    return this.redis;
  }

  public isRedisConnected(): boolean {
    return this.isConnected && this.redis !== null;
  }

  public async disconnect(): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.disconnect();
        logger.info('Redis disconnected successfully');
      } catch (error) {
        logger.error('Error disconnecting Redis', { error });
      }
    }
  }

  // Helper method for rate limiting
  public createSendCommand(): SendCommandFn | null {
    if (!this.redis) return null;

    return async (...args: string[]): Promise<RedisReply> => {
      if (args.length === 0) return 0;
      const [command, ...commandArgs] = args;
      if (!command) return 0;

      try {
        const result = await this.redis!.call(command, ...commandArgs);
        return result as RedisReply;
      } catch (error) {
        console.warn('Redis command failed:', error);
        return 0;
      }
    };
  }
}

export default RedisService.getInstance();
