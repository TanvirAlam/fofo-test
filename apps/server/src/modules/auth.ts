import express, { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, param, validationResult } from 'express-validator';
import { UserRepository } from 'src/repositories/UserRepository';
import { validateRequest } from 'src/middleware/validation';
import { RegisterDto } from 'src/dtos/auth';
import { AuthenticatedRequest, LoginRequest, RegisterRequest } from 'src/types';
import { logger } from 'src/utils/logger';
import { config } from 'src/config';
import { authenticateToken } from 'src/middleware/auth';
import { passwordChangeLimiter } from 'src/middleware/rateLimit';
import {
  getRemainingLockoutTime,
  incrementFailedAttempts,
  isAccountLocked,
  resetFailedAttempts,
} from 'src/utils/passwordSecurity';
import { sendResponse } from 'src/utils/sendResponse';

const router: Router = express.Router();
const userRepository = new UserRepository();

// Register
router.post(
  '/register',
  validateRequest(RegisterDto),
  async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, phone }: RegisterRequest =
        req.body;

      const existingUser = await userRepository.findByEmail(email);
      if (existingUser) {
        return sendResponse(
          res,
          'error',
          409,
          'User already exists with this email'
        );
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await userRepository.create({
        email,
        password: hashedPassword,
        fullname: `${firstName ?? ''} ${lastName ?? ''}`.trim(),
      });

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        config.JWT_SECRET,
        { expiresIn: '7d' }
      );

      logger.info(`User registered: ${user.email}`);
      return sendResponse(res, 'success', 201, 'User registered successfully', {
        user,
        token,
      });
    } catch (error) {
      logger.error('Registration error:', error);
      return sendResponse(res, 'error', 500, 'Registration failed');
    }
  }
);

// Login
router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').exists()],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return sendResponse(res, 'error', 400, 'Validation failed', {
          errors: errors.array(),
        });
      }

      const { email, password }: LoginRequest = req.body;

      if (await isAccountLocked(email)) {
        const remainingTime = await getRemainingLockoutTime(email);
        logger.warn(`Login attempt on locked account: ${email}`, {
          ip: req.ip,
        });
        return sendResponse(
          res,
          'error',
          423,
          'Account is temporarily locked due to multiple failed attempts',
          { lockoutRemainingMinutes: remainingTime }
        );
      }

      const user = await userRepository.findByEmail(email);
      if (!user) {
        await incrementFailedAttempts(email);
        return sendResponse(res, 'error', 401, 'Invalid credentials');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        const attempts = await incrementFailedAttempts(email);
        logger.warn(`Failed login attempt for ${email}`, {
          attempts,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
        });
        return sendResponse(res, 'error', 401, 'Invalid credentials');
      }

      if (!user.isActive) {
        return sendResponse(res, 'error', 401, 'Account is inactive');
      }

      await resetFailedAttempts(email);
      await userRepository.update(user.id, { lastLogin: new Date() });

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        config.JWT_SECRET,
        { expiresIn: '7d' }
      );

      logger.info(`User logged in successfully: ${user.email}`, { ip: req.ip });
      return sendResponse(res, 'success', 200, 'Login successful', {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          phone: user.phone,
          role: user.role,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        token,
      });
    } catch (error) {
      logger.error('Login error:', error);
      return sendResponse(res, 'error', 500, 'Login failed');
    }
  }
);

// Get current user
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    return sendResponse(res, 'success', 200, 'User profile retrieved', {
      user: req.user,
    });
  } catch (error) {
    logger.error('Get user profile error:', error);
    return sendResponse(res, 'error', 500, 'Failed to get user profile');
  }
});

// Refresh token
router.post(
  '/refresh',
  authenticateToken,
  async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) return sendResponse(res, 'error', 401, 'User not found');

      const token = jwt.sign(
        { userId: req.user.id, email: req.user.email, role: req.user.role },
        config.JWT_SECRET,
        { expiresIn: '7d' }
      );
      return sendResponse(res, 'success', 200, 'Token refreshed', { token });
    } catch (error) {
      logger.error('Token refresh error:', error);
      return sendResponse(res, 'error', 500, 'Token refresh failed');
    }
  }
);

// Logout
router.post(
  '/logout',
  authenticateToken,
  async (req: AuthenticatedRequest, res) => {
    try {
      logger.info(`User logged out: ${req.user?.email}`);
      return sendResponse(res, 'success', 200, 'Logout successful');
    } catch (error) {
      logger.error('Logout error:', error);
      return sendResponse(res, 'error', 500, 'Logout failed');
    }
  }
);

// Change password
router.post(
  '/change-password',
  [
    authenticateToken,
    passwordChangeLimiter,
    body('currentPassword').exists(),
    body('newPassword').isLength({ min: 6 }),
  ],
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return sendResponse(res, 'error', 400, 'Validation failed', {
          errors: errors.array(),
        });

      const { currentPassword, newPassword } = req.body;
      const userId = req.user?.id;
      if (!userId)
        return sendResponse(res, 'error', 401, 'User not authenticated');

      const user = await userRepository.findByEmail(req.user!.email);
      if (!user) return sendResponse(res, 'error', 404, 'User not found');

      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isValidPassword)
        return sendResponse(res, 'error', 401, 'Current password is incorrect');

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const updated = await userRepository.updatePassword(
        userId,
        hashedPassword
      );
      if (!updated) throw new Error('Failed to update password');

      logger.info(`Password changed for user: ${user.email}`);
      return sendResponse(res, 'success', 200, 'Password changed successfully');
    } catch (error) {
      logger.error('Change password error:', error);
      return sendResponse(res, 'error', 500, 'Password change failed');
    }
  }
);

// Lockout status
router.get(
  '/lockout-status/:email',
  [param('email').isEmail().normalizeEmail()],
  async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      if (!email)
        return sendResponse(res, 'error', 400, 'Email parameter is required');

      const locked = await isAccountLocked(email);
      const remainingTime = locked ? await getRemainingLockoutTime(email) : 0;

      return sendResponse(res, 'success', 200, 'Lockout status retrieved', {
        locked,
        remainingMinutes: remainingTime,
      });
    } catch (error) {
      logger.error('Check lockout status error:', error);
      return sendResponse(res, 'error', 500, 'Failed to check lockout status');
    }
  }
);

export default router;
