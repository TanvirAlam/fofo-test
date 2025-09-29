import {
  Resolver,
  Query,
  Mutation,
  Arg,
  UseMiddleware,
  InputType,
  Field,
} from 'type-graphql';
import { Length, IsOptional } from 'class-validator';
import { RFLCTCode, RFLCTType } from '../entities/RFLCTCode';
import { User } from '../entities/User';
import { drizzleDb, schema } from '../../db';
import { logger } from '../../utils/logger';
import { eq, desc, sql } from 'drizzle-orm';

// Input types
@InputType()
class CreateRFLCTCodeInput {
  @Field()
  @Length(4, 4) // Enforces 4-digit codes as per user preference
  code!: string;

  @Field(() => RFLCTType)
  type!: RFLCTType;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  userId?: string;
}

// Context type
interface Context {
  user?: User;
}

// Authentication middleware
function AuthMiddleware(
  { context }: { context: Context },
  next: () => Promise<unknown>
) {
  if (!context.user) {
    throw new Error('Authentication required');
  }
  return next();
}

@Resolver(RFLCTCode)
export class RFLCTResolver {
  @Query(() => [RFLCTCode])
  @UseMiddleware(AuthMiddleware)
  async rflctCodes(
    @Arg('limit', { defaultValue: 50 }) limit: number,
    @Arg('offset', { defaultValue: 0 }) offset: number,
    @Arg('isActive', { nullable: true }) isActive?: boolean
  ): Promise<RFLCTCode[]> {
    const baseQuery = drizzleDb
      .select({
        id: schema.rflctCodes.id,
        code: schema.rflctCodes.code,
        type: schema.rflctCodes.type,
        description: schema.rflctCodes.description,
        isActive: schema.rflctCodes.isActive,
        userId: schema.rflctCodes.userId,
        usageCount: schema.rflctCodes.usageCount,
        lastUsed: schema.rflctCodes.lastUsed,
        metadata: schema.rflctCodes.metadata,
        createdAt: schema.rflctCodes.createdAt,
        updatedAt: schema.rflctCodes.updatedAt,
      })
      .from(schema.rflctCodes);

    const query =
      isActive !== undefined
        ? baseQuery.where(eq(schema.rflctCodes.isActive, isActive))
        : baseQuery;

    const result = await query
      .orderBy(desc(schema.rflctCodes.createdAt))
      .limit(limit)
      .offset(offset);

    return result as RFLCTCode[];
  }

  @Query(() => RFLCTCode, { nullable: true })
  async rflctCode(@Arg('code') code: string): Promise<RFLCTCode | null> {
    const result = await drizzleDb
      .select({
        id: schema.rflctCodes.id,
        code: schema.rflctCodes.code,
        type: schema.rflctCodes.type,
        description: schema.rflctCodes.description,
        isActive: schema.rflctCodes.isActive,
        userId: schema.rflctCodes.userId,
        usageCount: schema.rflctCodes.usageCount,
        lastUsed: schema.rflctCodes.lastUsed,
        metadata: schema.rflctCodes.metadata,
        createdAt: schema.rflctCodes.createdAt,
        updatedAt: schema.rflctCodes.updatedAt,
      })
      .from(schema.rflctCodes)
      .where(eq(schema.rflctCodes.code, code))
      .limit(1);

    return (result[0] as RFLCTCode) || null;
  }

  @Mutation(() => RFLCTCode)
  @UseMiddleware(AuthMiddleware)
  async createRFLCTCode(
    @Arg('input') input: CreateRFLCTCodeInput
  ): Promise<RFLCTCode> {
    try {
      // Validate 4-digit code format
      if (!/^\d{4}$/.test(input.code)) {
        throw new Error('RFLCT code must be exactly 4 digits');
      }

      // Check if code already exists
      const existingCode = await this.rflctCode(input.code);
      if (existingCode) {
        throw new Error('RFLCT code already exists');
      }

      const result = await drizzleDb
        .insert(schema.rflctCodes)
        .values({
          code: input.code,
          type: input.type,
          description: input.description || null,
          userId: input.userId || null,
          isActive: true,
          usageCount: 0,
        })
        .returning({
          id: schema.rflctCodes.id,
          code: schema.rflctCodes.code,
          type: schema.rflctCodes.type,
          description: schema.rflctCodes.description,
          isActive: schema.rflctCodes.isActive,
          userId: schema.rflctCodes.userId,
          usageCount: schema.rflctCodes.usageCount,
          lastUsed: schema.rflctCodes.lastUsed,
          metadata: schema.rflctCodes.metadata,
          createdAt: schema.rflctCodes.createdAt,
          updatedAt: schema.rflctCodes.updatedAt,
        });

      const newCode = result[0];

      logger.info(`RFLCT code created: ${input.code} (type: ${input.type})`);

      return newCode as RFLCTCode;
    } catch (error) {
      logger.error('Create RFLCT code error:', error);
      throw new Error(
        `Failed to create RFLCT code: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  @Mutation(() => RFLCTCode)
  async useRFLCTCode(@Arg('code') code: string): Promise<RFLCTCode> {
    try {
      // Find the code
      const rflctCode = await this.rflctCode(code);
      if (!rflctCode) {
        throw new Error('RFLCT code not found');
      }

      if (!rflctCode.isActive) {
        throw new Error('RFLCT code is inactive');
      }

      // Update usage count and last used
      const result = await drizzleDb
        .update(schema.rflctCodes)
        .set({
          usageCount: sql`${schema.rflctCodes.usageCount} + 1`,
          lastUsed: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(schema.rflctCodes.code, code))
        .returning({
          id: schema.rflctCodes.id,
          code: schema.rflctCodes.code,
          type: schema.rflctCodes.type,
          description: schema.rflctCodes.description,
          isActive: schema.rflctCodes.isActive,
          userId: schema.rflctCodes.userId,
          usageCount: schema.rflctCodes.usageCount,
          lastUsed: schema.rflctCodes.lastUsed,
          metadata: schema.rflctCodes.metadata,
          createdAt: schema.rflctCodes.createdAt,
          updatedAt: schema.rflctCodes.updatedAt,
        });

      const updatedCode = result[0];
      if (!updatedCode) {
        throw new Error('Failed to update RFLCT code');
      }

      logger.info(
        `RFLCT code used: ${code} (usage count: ${updatedCode.usageCount})`
      );

      // Here you could implement specific logic based on the code type
      switch (updatedCode.type) {
        case RFLCTType.USER_ACCESS:
          logger.info(`User access granted via RFLCT code: ${code}`);
          break;
        case RFLCTType.FEATURE_UNLOCK:
          logger.info(`Feature unlocked via RFLCT code: ${code}`);
          break;
        case RFLCTType.PROMOTION:
          logger.info(`Promotion applied via RFLCT code: ${code}`);
          break;
        // Add more cases as needed
      }

      return updatedCode as RFLCTCode;
    } catch (error) {
      logger.error('Use RFLCT code error:', error);
      throw new Error(
        `Failed to use RFLCT code: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(AuthMiddleware)
  async deactivateRFLCTCode(@Arg('code') code: string): Promise<boolean> {
    try {
      const result = await drizzleDb
        .update(schema.rflctCodes)
        .set({
          isActive: false,
          updatedAt: new Date(),
        })
        .where(eq(schema.rflctCodes.code, code));

      if (result.rowCount === 0) {
        throw new Error('RFLCT code not found');
      }

      logger.info(`RFLCT code deactivated: ${code}`);
      return true;
    } catch (error) {
      logger.error('Deactivate RFLCT code error:', error);
      throw new Error(
        `Failed to deactivate RFLCT code: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  @Query(() => [String])
  @UseMiddleware(AuthMiddleware)
  async generateRandomRFLCTCodes(
    @Arg('count', { defaultValue: 10 }) count: number
  ): Promise<string[]> {
    const codes: string[] = [];

    for (let i = 0; i < Math.min(count, 100); i++) {
      let code: string;
      let attempts = 0;

      // Generate unique 4-digit code
      do {
        code = Math.floor(1000 + Math.random() * 9000).toString();
        attempts++;

        // Prevent infinite loop
        if (attempts > 100) {
          throw new Error('Unable to generate unique RFLCT codes');
        }
      } while (await this.rflctCode(code));

      codes.push(code);
    }

    logger.info(`Generated ${codes.length} unique 4-digit RFLCT codes`);
    return codes;
  }
}
