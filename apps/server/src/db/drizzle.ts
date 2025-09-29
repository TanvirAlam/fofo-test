import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import {
  config,
  dbMaxPoolSize,
  dbMinPoolSize,
  dbConnTimeoutMs,
} from '../config';
import { attachSqlLogger } from './helper';
import { logger } from '../utils/logger';
import { PRODUCTION } from '../utils/constant';

export class DatabaseService {
  private static instance: DatabaseService;
  private pool: Pool;
  private drizzleClient: ReturnType<typeof drizzle>;

  private constructor() {
    this.pool = new Pool({
      connectionString: config.DATABASE_URL,
      max: dbMaxPoolSize,
      min: dbMinPoolSize,
      idleTimeoutMillis: config.DB_IDLE_TIMEOUT_MS,
      connectionTimeoutMillis: dbConnTimeoutMs,
      statement_timeout: config.DB_STATEMENT_TIMEOUT_MS,
      query_timeout: config.DB_QUERY_TIMEOUT_MS,
      application_name: 'foodime_server',
      ssl:
        config.NODE_ENV === PRODUCTION ? { rejectUnauthorized: true } : false,
    });

    this.pool.on('error', err => {
      logger.error('Database pool error:', err);
    });

    attachSqlLogger(this.pool);

    this.drizzleClient = drizzle(this.pool, { schema, logger: false });
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }

  public getDrizzle() {
    return this.drizzleClient;
  }

  public async query(text: string, params?: unknown[]) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      logger.debug(`Query executed in ${duration}ms: ${text}`);
      return res;
    } catch (error) {
      logger.error('Database query error:', error);
      throw error;
    }
  }

  public async close() {
    await this.pool.end();
    logger.info('Database connection closed');
  }

  public async healthCheck() {
    const start = Date.now();
    try {
      await this.pool.query('SELECT 1');
      const latency = Date.now() - start;
      logger.debug(`Database health check passed in ${latency}ms`);
      return { healthy: true, latency };
    } catch (error) {
      const latency = Date.now() - start;
      logger.error('Database health check failed:', error);
      return { healthy: false, latency, error };
    }
  }

  public getConnectionInfo() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }
}

// Export singleton instance
const dbService = DatabaseService.getInstance();
export const pool = dbService.getPool();
export const drizzleDb = dbService.getDrizzle();

export { schema };
