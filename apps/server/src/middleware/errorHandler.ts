import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { ApiError } from '../types';
import { Sentry } from '../config/sentry';
import { config } from '../config';

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`${error.message} - ${req.method} ${req.path} - ${req.ip}`, {
    stack: error.stack,
    body: req.body,
    query: req.query,
    headers: req.headers,
  });

  let statusCode = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  if (config.NODE_ENV === 'production') {
    if (statusCode >= 500) {
      message = 'Internal Server Error';
    }
  }

  if (error.name === 'PrismaClientKnownRequestError') {
    statusCode = 400;
    message = 'Database operation failed';
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.message.includes('duplicate key')) {
    statusCode = 409;
    message = 'Resource already exists';
  }

  if (statusCode >= 500 && config.SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: {
        path: req.path,
        method: req.method,
        query: req.query,
        body: req.body,
      },
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
    ...(config.NODE_ENV === 'development' && { stack: error.stack }),
    ...(statusCode >= 500 && { errorId: `ERR-${Date.now()}` }),
  });
};
