import 'reflect-metadata';
import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { Server as HttpServer } from 'http';
import { ApolloServer } from '@apollo/server';
import { AuthChecker, buildSchema } from 'type-graphql';
import { UserResolver } from './resolvers/UserResolver';
import { RFLCTResolver } from './resolvers/RFLCTResolver';
import { expressMiddleware } from '@as-integrations/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import {
  createComplexityRule,
  simpleEstimator,
} from 'graphql-query-complexity';
import { config } from '../config';
import { logger } from '../utils/logger';
import { GraphQLContext, JWTPayload } from '../types';
import { UserRepository } from '../repositories/UserRepository';
import { PRODUCTION } from '../utils/constant';

export async function createGraphQLServer(
  httpServer: HttpServer
): Promise<ApolloServer> {
  try {
    const authChecker: AuthChecker<GraphQLContext> = ({ context }) => {
      if (!context.user) {
        return false;
      }

      if (!context.user.isActive) {
        return false;
      }

      return true;
    };

    const schema = await buildSchema({
      resolvers: [UserResolver, RFLCTResolver],
      validate: true,
      authChecker,
    });

    const server = new ApolloServer({
      schema,
      plugins: [responseCachePlugin()],
      validationRules: [
        createComplexityRule({
          maximumComplexity: 1000,
          estimators: [simpleEstimator({ defaultComplexity: 1 })],
          onComplete: complexity => {
            logger.debug('Query Complexity:', complexity);
          },
        }),
      ],
      formatError: error => {
        logger.error('GraphQL Error:', error);

        if (config.NODE_ENV === PRODUCTION) {
          return new Error('Internal server error');
        }

        return error;
      },
    });

    await server.start();
    logger.info('GraphQL server initialized at /graphql');

    logger.info('GraphQL server configured successfully');
    return server;
  } catch (error) {
    logger.error('Failed to create GraphQL server:', error);
    throw error;
  }
}

export function createGraphQLMiddleware(server: ApolloServer): RequestHandler {
  return expressMiddleware(server, {
    context: async ({ req, res }): Promise<GraphQLContext> => {
      let user = undefined;

      const authorization = req.headers.authorization;
      if (authorization) {
        try {
          const token = authorization.replace('Bearer ', '');
          const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;

          const userRepository = new UserRepository();
          const foundUser = await userRepository.findById(decoded.userId);

          if (foundUser && foundUser.isActive) {
            user = foundUser;
          }
        } catch (error) {
          logger.debug('Invalid token or user not found:', error);
        }
      }

      return { user, req, res };
    },
  });
}
