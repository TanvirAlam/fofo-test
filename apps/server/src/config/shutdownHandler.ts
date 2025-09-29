import { ApolloServer } from './apolloServer';
import { Database } from './database';
import redisService from '../services/RedisService';
import { logger } from '../utils/logger';
import { Sentry } from './sentry';
import { config } from './index';

export class ShutdownHandler {
  constructor(
    private apolloServer: ApolloServer,
    private database: Database
  ) {
    this.setupProcessHandlers();
  }

  private setupProcessHandlers(): void {
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
    process.on('SIGINT', this.gracefulShutdown.bind(this));
    process.on('uncaughtException', this.handleUncaughtException.bind(this));
    process.on('unhandledRejection', this.handleUnhandledRejection.bind(this));
  }

  private handleUncaughtException(error: Error): void {
    logger.error('Uncaught Exception:', error);
    if (config.SENTRY_DSN) {
      Sentry.captureException(error);
    }
    this.gracefulShutdown();
  }

  private handleUnhandledRejection(
    reason: unknown,
    promise: Promise<unknown>
  ): void {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    if (config.SENTRY_DSN) {
      Sentry.captureException(
        reason instanceof Error ? reason : new Error(String(reason))
      );
    }
    this.gracefulShutdown();
  }

  private async gracefulShutdown(): Promise<void> {
    logger.info('Shutting down server gracefully...');

    try {
      await this.apolloServer.close();
      await this.database.disconnect();
      await redisService.disconnect();

      logger.info('Server shutdown complete');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  }
}
