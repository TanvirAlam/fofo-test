import * as Sentry from '@sentry/node';
import { config } from './index';
import { logger } from '../utils/logger';
import { PRODUCTION } from '../utils/constant';

export const initializeSentry = (): void => {
  if (!config.SENTRY_DSN) {
    logger.info('SENTRY_DSN not provided, skipping Sentry initialization');
    return;
  }

  Sentry.init({
    dsn: config.SENTRY_DSN,
    environment: config.NODE_ENV,
    tracesSampleRate: config.NODE_ENV === PRODUCTION ? 0.1 : 1.0,
    release: config.SENTRY_RELEASE,

    beforeSend(event) {
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }
      if (
        event.request?.data &&
        typeof event.request.data === 'object' &&
        event.request.data !== null
      ) {
        const sensitiveFields = ['password', 'token', 'secret', 'key'];
        const data = event.request.data as Record<string, any>;
        sensitiveFields.forEach(field => {
          if (field in data) {
            data[field] = '[Filtered]';
          }
        });
      }

      return event;
    },
  });

  logger.info(`Sentry initialized for environment: ${config.NODE_ENV}`);
};

export { Sentry };
