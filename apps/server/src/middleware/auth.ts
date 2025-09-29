import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { AuthenticatedRequest, JWTPayload } from '../types';
import { logger } from '../utils/logger';
import { config } from '../config';

const userRepository = new UserRepository();

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;

    // Get user from database
    const user = await userRepository.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive',
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Token expired',
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;
    const user = await userRepository.findById(decoded.userId);

    if (user && user.isActive) {
      req.user = user;
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.debug('Optional auth: Token expired', { ip: req.ip });
      return next();
    }

    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Optional auth: Suspicious token manipulation detected', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        token: `${req.headers.authorization?.substring(0, 20)}...`,
      });
      return next();
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error('Optional auth: Unexpected error', {
      error: errorMessage,
      ip: req.ip,
    });
    next();
  }
};

// Role-based authorization
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
      });
    }

    next();
  };
};

// Admin only
export const requireAdmin = requireRole(['ADMIN', 'SUPER_ADMIN']);

// Restaurant owner or admin
export const requireRestaurantAccess = requireRole([
  'RESTAURANT_OWNER',
  'ADMIN',
  'SUPER_ADMIN',
]);
