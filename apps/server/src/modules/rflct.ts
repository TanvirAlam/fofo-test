import express, { Router, Response } from 'express';
import { body, validationResult, query } from 'express-validator';
import { drizzleDb } from '../db';
import { rflctCodes, users } from '../db/schema';
import { eq, and, desc, count, sum, isNotNull } from 'drizzle-orm';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import {
  AuthenticatedRequest,
  CreateRFLCTCodeRequest,
  VerifyRFLCTCodeRequest,
} from '../types';
import { logger } from '../utils/logger';
import {
  generateUniqueRFLCTCode,
  sanitizeRFLCTResponse,
} from 'src/utils/rflctHelper';

const router: Router = express.Router();

// Create RFLCT code (Admin only)
router.post(
  '/codes',
  [
    authenticateToken,
    requireAdmin,
    body('type').isIn([
      'USER_ACCESS',
      'FEATURE_UNLOCK',
      'PROMOTION',
      'SPECIAL_ACTION',
      'SYSTEM_COMMAND',
    ]),
    body('description').optional().trim(),
    body('metadata').optional().isObject(),
  ],
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { type, description, metadata }: CreateRFLCTCodeRequest = req.body;

      const code = await generateUniqueRFLCTCode();

      const [rflctCode] = await drizzleDb
        .update(rflctCodes)
        .set({
          type: type as any,
          description,
          metadata,
          isActive: true,
        })
        .where(eq(rflctCodes.code, code))
        .returning();

      logger.info(
        `RFLCT code created: ${code} (${type}) by ${req.user?.email}`
      );

      res.status(201).json({
        success: true,
        message: 'RFLCT code created successfully',
        data: rflctCode,
      });
    } catch (error) {
      logger.error('Create RFLCT code error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create RFLCT code',
      });
    }
  }
);

router.post(
  '/verify',
  [authenticateToken, body('code').isLength({ min: 4, max: 4 }).isNumeric()],
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array(),
        });
      }

      const { code }: VerifyRFLCTCodeRequest = req.body;
      const userId = req.user?.id;
      const userRole = req.user?.role || 'USER';

      const [rflctCode] = await drizzleDb
        .select()
        .from(rflctCodes)
        .where(eq(rflctCodes.code, code))
        .limit(1);

      if (!rflctCode) {
        return res.status(404).json({
          success: false,
          message: 'RFLCT code not found',
        });
      }

      if (!rflctCode.isActive) {
        return res.status(400).json({
          success: false,
          message: 'RFLCT code is inactive',
        });
      }

      const [updatedCode] = await drizzleDb
        .update(rflctCodes)
        .set({
          usageCount: rflctCode.usageCount + 1,
          lastUsed: new Date(),
          ...(userId && !rflctCode.userId && { userId }),
        })
        .where(eq(rflctCodes.id, rflctCode.id))
        .returning();

      if (!updatedCode) {
        return res.status(500).json({
          success: false,
          message: 'Failed to update RFLCT code',
        });
      }

      logger.info(`RFLCT code used: ${code} by user ${userId}`);

      return res.json({
        success: true,
        message: 'RFLCT code verified successfully',
        data: sanitizeRFLCTResponse(updatedCode, userRole),
      });
    } catch (error) {
      logger.error('Verify RFLCT code error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify RFLCT code',
      });
    }
  }
);

// Get user's RFLCT codes
router.get(
  '/my-codes',
  authenticateToken,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;

      const codes = await drizzleDb
        .select({
          id: rflctCodes.id,
          code: rflctCodes.code,
          type: rflctCodes.type,
          description: rflctCodes.description,
          isActive: rflctCodes.isActive,
          usageCount: rflctCodes.usageCount,
          lastUsed: rflctCodes.lastUsed,
          createdAt: rflctCodes.createdAt,
        })
        .from(rflctCodes)
        .where(
          userId
            ? eq(rflctCodes.userId, userId)
            : eq(rflctCodes.type, 'USER_ACCESS')
        )
        .orderBy(desc(rflctCodes.createdAt));

      res.json({
        success: true,
        message: 'RFLCT codes retrieved successfully',
        data: codes,
      });
    } catch (error) {
      logger.error('Get user RFLCT codes error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve RFLCT codes',
      });
    }
  }
);

// List all RFLCT codes (Admin only)
router.get(
  '/codes',
  [
    authenticateToken,
    requireAdmin,
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('type')
      .optional()
      .isIn([
        'USER_ACCESS',
        'FEATURE_UNLOCK',
        'PROMOTION',
        'SPECIAL_ACTION',
        'SYSTEM_COMMAND',
      ]),
    query('isActive').optional().isBoolean(),
  ],
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const skip = (page - 1) * limit;

      const whereConditions = [];
      if (req.query.type)
        whereConditions.push(eq(rflctCodes.type, req.query.type as any));
      if (req.query.isActive !== undefined)
        whereConditions.push(
          eq(rflctCodes.isActive, req.query.isActive === 'true')
        );

      const whereClause =
        whereConditions.length > 0 ? and(...whereConditions) : undefined;

      const [codes, totalResult] = await Promise.all([
        drizzleDb
          .select({
            id: rflctCodes.id,
            code: rflctCodes.code,
            type: rflctCodes.type,
            description: rflctCodes.description,
            isActive: rflctCodes.isActive,
            usageCount: rflctCodes.usageCount,
            lastUsed: rflctCodes.lastUsed,
            createdAt: rflctCodes.createdAt,
            updatedAt: rflctCodes.updatedAt,
            metadata: rflctCodes.metadata,
            user: {
              id: users.id,
              email: users.email,
              fullName: users.fullName,
            },
          })
          .from(rflctCodes)
          .leftJoin(users, eq(rflctCodes.userId, users.id))
          .where(whereClause)
          .limit(limit)
          .offset(skip)
          .orderBy(desc(rflctCodes.createdAt)),
        drizzleDb
          .select({ count: count() })
          .from(rflctCodes)
          .where(whereClause),
      ]);

      const total = totalResult[0]?.count || 0;

      res.json({
        success: true,
        message: 'RFLCT codes retrieved successfully',
        data: codes,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      logger.error('List RFLCT codes error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve RFLCT codes',
      });
    }
  }
);

// Update RFLCT code (Admin only)
router.patch(
  '/codes/:id',
  [
    authenticateToken,
    requireAdmin,
    body('description').optional().trim(),
    body('isActive').optional().isBoolean(),
    body('metadata').optional().isObject(),
  ],
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID parameter is required',
        });
      }

      const updateData = req.body;

      const updatedCodes = await drizzleDb
        .update(rflctCodes)
        .set(updateData)
        .where(eq(rflctCodes.id, id))
        .returning();

      const updatedCode = updatedCodes[0];
      if (!updatedCode) {
        return res.status(404).json({
          success: false,
          message: 'RFLCT code not found',
        });
      }

      logger.info(
        `RFLCT code updated: ${updatedCode.code} by ${req.user?.email}`
      );

      res.json({
        success: true,
        message: 'RFLCT code updated successfully',
        data: updatedCode,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('no rows')) {
        return res.status(404).json({
          success: false,
          message: 'RFLCT code not found',
        });
      }

      logger.error('Update RFLCT code error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update RFLCT code',
      });
    }
  }
);

// Delete RFLCT code (Admin only)
router.delete(
  '/codes/:id',
  [authenticateToken, requireAdmin],
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID parameter is required',
        });
      }

      const deletedCodes = await drizzleDb
        .delete(rflctCodes)
        .where(eq(rflctCodes.id, id))
        .returning();

      const deletedCode = deletedCodes[0];
      if (!deletedCode) {
        return res.status(404).json({
          success: false,
          message: 'RFLCT code not found',
        });
      }

      logger.info(
        `RFLCT code deleted: ${deletedCode.code} by ${req.user?.email}`
      );

      res.json({
        success: true,
        message: 'RFLCT code deleted successfully',
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('no rows')) {
        return res.status(404).json({
          success: false,
          message: 'RFLCT code not found',
        });
      }

      logger.error('Delete RFLCT code error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete RFLCT code',
      });
    }
  }
);

// RFLCT code analytics (Admin only)
router.get(
  '/analytics',
  [authenticateToken, requireAdmin],
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const [totalCodesResult, activeCodesResult, totalUsageResult] =
        await Promise.all([
          drizzleDb.select({ count: count() }).from(rflctCodes),
          drizzleDb
            .select({ count: count() })
            .from(rflctCodes)
            .where(eq(rflctCodes.isActive, true)),
          drizzleDb
            .select({ sum: sum(rflctCodes.usageCount) })
            .from(rflctCodes),
        ]);

      const totalCodes = totalCodesResult[0]?.count || 0;
      const activeCodes = activeCodesResult[0]?.count || 0;
      const totalUsage = totalUsageResult[0]?.sum || 0;

      // Note: Drizzle doesn't have groupBy in the same way as Prisma
      // We'll need to use raw SQL for this or do it differently
      const codesByTypeResult = await drizzleDb
        .selectDistinct({
          type: rflctCodes.type,
        })
        .from(rflctCodes);

      const codesByType = await Promise.all(
        codesByTypeResult.map(async ({ type }) => {
          const typeCountResult = await drizzleDb
            .select({ count: count() })
            .from(rflctCodes)
            .where(eq(rflctCodes.type, type));
          const typeCount = typeCountResult[0]?.count || 0;
          return { type, count: typeCount };
        })
      );

      const recentActivity = await drizzleDb
        .select({
          code: rflctCodes.code,
          type: rflctCodes.type,
          usageCount: rflctCodes.usageCount,
          lastUsed: rflctCodes.lastUsed,
        })
        .from(rflctCodes)
        .where(isNotNull(rflctCodes.lastUsed))
        .orderBy(desc(rflctCodes.lastUsed))
        .limit(10);

      res.json({
        success: true,
        message: 'RFLCT analytics retrieved successfully',
        data: {
          summary: {
            totalCodes,
            activeCodes,
            totalUsage,
          },
          codesByType,
          recentActivity,
        },
      });
    } catch (error) {
      logger.error('RFLCT analytics error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve RFLCT analytics',
      });
    }
  }
);

export default router;
