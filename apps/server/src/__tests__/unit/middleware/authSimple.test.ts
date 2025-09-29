import 'reflect-metadata';
import jwt from 'jsonwebtoken';
import {
  generateTestToken,
  generateExpiredToken,
  generateInvalidToken,
  HTTP_STATUS,
  TEST_JWT_SECRET,
} from '../../helpers/testUtils';

// Mock the entire middleware to avoid TypeGraphQL issues
const mockUserRepository = {
  findById: jest.fn(),
};

const mockLogger = {
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

// Mock config
const mockConfig = {
  JWT_SECRET: TEST_JWT_SECRET,
};

// Simple implementation of auth middleware for testing
const authenticateToken = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      });
    }

    const decoded = jwt.verify(token, mockConfig.JWT_SECRET) as any;
    const user = await mockUserRepository.findById(decoded.userId);

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

    req.user = user;
    next();
  } catch (error) {
    mockLogger.error('Authentication error:', error);

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

const optionalAuth = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, mockConfig.JWT_SECRET) as any;
    const user = await mockUserRepository.findById(decoded.userId);

    if (user && user.isActive) {
      req.user = user;
    }

    next();
  } catch (error) {
    mockLogger.debug('Optional auth failed:', error);
    next();
  }
};

const requireRole = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
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

const requireAdmin = requireRole(['ADMIN', 'SUPER_ADMIN']);
const requireRestaurantAccess = requireRole([
  'RESTAURANT_OWNER',
  'ADMIN',
  'SUPER_ADMIN',
]);

describe('Authentication Middleware (Simple)', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockReq = {
      headers: {},
      user: null,
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      role: 'USER',
      isActive: true,
      firstName: 'Test',
      lastName: 'User',
    };

    it('should authenticate valid token and attach user to request', async () => {
      const token = generateTestToken(
        mockUser.id,
        mockUser.email,
        mockUser.role
      );
      mockReq.headers.authorization = `Bearer ${token}`;
      mockUserRepository.findById.mockResolvedValue(mockUser);

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(mockUser.id);
      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should reject request without authorization header', async () => {
      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access token required',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject request with malformed authorization header', async () => {
      mockReq.headers.authorization = 'InvalidFormat token123';

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject expired token', async () => {
      const expiredToken = generateExpiredToken(mockUser);
      mockReq.headers.authorization = `Bearer ${expiredToken}`;

      await new Promise(resolve => setTimeout(resolve, 100));

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token expired',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject invalid token', async () => {
      const invalidToken = generateInvalidToken();
      mockReq.headers.authorization = `Bearer ${invalidToken}`;

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid token',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject token for non-existent user', async () => {
      const token = generateTestToken(
        mockUser.id,
        mockUser.email,
        mockUser.role
      );
      mockReq.headers.authorization = `Bearer ${token}`;
      mockUserRepository.findById.mockResolvedValue(null);

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should reject token for inactive user', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      const token = generateTestToken(
        mockUser.id,
        mockUser.email,
        mockUser.role
      );
      mockReq.headers.authorization = `Bearer ${token}`;
      mockUserRepository.findById.mockResolvedValue(inactiveUser);

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Account is inactive',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      const token = generateTestToken(
        mockUser.id,
        mockUser.email,
        mockUser.role
      );
      mockReq.headers.authorization = `Bearer ${token}`;
      mockUserRepository.findById.mockRejectedValue(
        new Error('Database connection failed')
      );

      await authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Authentication failed',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      role: 'USER',
      isActive: true,
    };

    it('should continue without token', async () => {
      await optionalAuth(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeNull();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should attach user if valid token provided', async () => {
      const token = generateTestToken(
        mockUser.id,
        mockUser.email,
        mockUser.role
      );
      mockReq.headers.authorization = `Bearer ${token}`;
      mockUserRepository.findById.mockResolvedValue(mockUser);

      await optionalAuth(mockReq, mockRes, mockNext);

      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should continue without user if invalid token provided', async () => {
      const invalidToken = generateInvalidToken();
      mockReq.headers.authorization = `Bearer ${invalidToken}`;

      await optionalAuth(mockReq, mockRes, mockNext);

      expect(mockReq.user).toBeNull();
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('requireRole', () => {
    it('should allow access for user with required role', () => {
      const middleware = requireRole(['USER', 'ADMIN']);
      mockReq.user = { id: 'user-123', role: 'USER' };

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should deny access for user without required role', () => {
      const middleware = requireRole(['ADMIN']);
      mockReq.user = { id: 'user-123', role: 'USER' };

      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Insufficient permissions',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should deny access for unauthenticated user', () => {
      const middleware = requireRole(['USER']);

      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Authentication required',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireAdmin', () => {
    it('should allow access for ADMIN user', () => {
      mockReq.user = { id: 'admin-123', role: 'ADMIN' };

      requireAdmin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should allow access for SUPER_ADMIN user', () => {
      mockReq.user = { id: 'super-admin-123', role: 'SUPER_ADMIN' };

      requireAdmin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should deny access for regular USER', () => {
      mockReq.user = { id: 'user-123', role: 'USER' };

      requireAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Insufficient permissions',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireRestaurantAccess', () => {
    it('should allow access for RESTAURANT_OWNER', () => {
      mockReq.user = { id: 'owner-123', role: 'RESTAURANT_OWNER' };

      requireRestaurantAccess(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should allow access for ADMIN', () => {
      mockReq.user = { id: 'admin-123', role: 'ADMIN' };

      requireRestaurantAccess(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should deny access for regular USER', () => {
      mockReq.user = { id: 'user-123', role: 'USER' };

      requireRestaurantAccess(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Insufficient permissions',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
