import { drizzleDb } from 'src/db';
import { rflctCodes } from 'src/db/schema';
import { logger } from './logger';
import { ROLES } from './constant';

export const sanitizeRFLCTResponse = (code: any, userRole: string) => {
  const baseResponse = {
    type: code.type,
    description: code.description,
    usageCount: code.usageCount,
  };

  if (userRole === ROLES.ADMIN || userRole === ROLES.SUPER_ADMIN) {
    return {
      ...baseResponse,
      code: code.code,
      metadata: code.metadata,
      isActive: code.isActive,
      lastUsed: code.lastUsed,
      createdAt: code.createdAt,
    };
  }

  return {
    ...baseResponse,
    metadata: code.metadata
      ? {
          description: code.metadata.description,
          category: code.metadata.category,
        }
      : null,
  };
};

const generateRFLCTCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const generateUniqueRFLCTCode = async (
  maxRetries = 10
): Promise<string> => {
  for (let attempts = 0; attempts < maxRetries; attempts++) {
    const code = generateRFLCTCode();

    try {
      const [rflctCode] = await drizzleDb
        .insert(rflctCodes)
        .values({
          code,
          type: 'USER_ACCESS',
          isActive: false,
        })
        .returning({ id: rflctCodes.id, code: rflctCodes.code });

      if (!rflctCode) {
        throw new Error('Failed to insert RFLCT code');
      }
      return rflctCode.code;
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: unknown }).code === '23505'
      ) {
        logger.debug(
          `RFLCT code collision on attempt ${attempts + 1}: ${code}`
        );
        continue;
      }
      throw error;
    }
  }

  throw new Error(
    `Failed to generate unique RFLCT code after ${maxRetries} attempts`
  );
};
