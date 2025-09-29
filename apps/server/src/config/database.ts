import {
  connectDatabase as connectDB,
  disconnectDatabase as disconnectDB,
} from '../db';
import { logger } from '../utils/logger';

export class Database {
  public async connect(): Promise<void> {
    try {
      await connectDB();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await disconnectDB();
      logger.info('Database disconnected successfully');
    } catch (error) {
      logger.error('Error disconnecting database:', error);
      throw error;
    }
  }
}
