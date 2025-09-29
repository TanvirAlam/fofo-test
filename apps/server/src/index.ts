import 'reflect-metadata';
import 'express-async-errors';
import { logger } from './utils/logger';
import { config } from './config/index';
import { initializeSentry } from './config/sentry';
import { AppConfig } from './config/appConfig';
import { ApolloServer } from './config/apolloServer';
import { Database } from './config/database';
import { ShutdownHandler } from './config/shutdownHandler';
import { createGraphQLServer, createGraphQLMiddleware } from './graphql/server';
import { graphqlLimiter } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

class Server {
  private appConfig: AppConfig;
  private apolloServer: ApolloServer;
  private database: Database;
  private shutdownHandler?: ShutdownHandler;

  constructor() {
    this.appConfig = new AppConfig();
    this.apolloServer = new ApolloServer(this.appConfig.getApp());
    this.database = new Database();
    this.apolloServer.initializeSocketIO();
    this.appConfig.getApp().set('io', this.apolloServer.io);
  }

  private async initializeGraphQL(): Promise<void> {
    const server = await createGraphQLServer(this.apolloServer.httpServer);
    const gqlMiddleware = createGraphQLMiddleware(server);
    this.appConfig.getApp().use('/graphql', graphqlLimiter, gqlMiddleware);
  }

  private initializeErrorHandling(): void {
    this.appConfig.getApp().use(notFound);
    this.appConfig.getApp().use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      initializeSentry();
      await this.database.connect();
      await this.initializeGraphQL();
      this.initializeErrorHandling();
      this.shutdownHandler = new ShutdownHandler(
        this.apolloServer,
        this.database
      );

      this.apolloServer.start(config.PORT, () => {
        logger.info(`Server running on port ${config.PORT}`);
        logger.info(`Environment: ${config.NODE_ENV}`);
        logger.info(`Health check: http://localhost:${config.PORT}/health`);
        logger.info(
          `API Documentation: http://localhost:${config.PORT}/api/v1`
        );
        logger.info(
          `GraphQL Playground: http://localhost:${config.PORT}/graphql`
        );
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      if (this.shutdownHandler) {
        process.exit(1);
      } else {
        process.exit(1);
      }
    }
  }

  public async stop(): Promise<void> {
    if (this.shutdownHandler) {
      process.emit('SIGTERM');
    }
  }
}

const server = new Server();
server.start();

export default server;
