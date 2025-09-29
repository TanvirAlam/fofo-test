import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
  pgEnum,
  jsonb,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const rflctTypeEnum = pgEnum('rflct_type', [
  'USER_ACCESS',
  'FEATURE_UNLOCK',
  'PROMOTION',
  'SPECIAL_ACTION',
  'SYSTEM_COMMAND',
]);

export const rflctCodes = pgTable(
  'rflct_codes',
  {
    id: text('id').primaryKey().default('gen_random_uuid()'),
    code: text('code').notNull().unique(),
    type: rflctTypeEnum('type').notNull(),
    description: text('description'),
    isActive: boolean('is_active').notNull().default(true),
    userId: text('user_id').references(() => users.id),
    usageCount: integer('usage_count').notNull().default(0),
    lastUsed: timestamp('last_used'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    uniqueIndex('rflct_codes_code_idx').on(table.code),
    index('rflct_codes_type_idx').on(table.type),
    index('rflct_codes_is_active_idx').on(table.isActive),
    index('rflct_codes_user_id_idx').on(table.userId),
    index('rflct_codes_usage_count_idx').on(table.usageCount),
    index('rflct_codes_last_used_idx').on(table.lastUsed),
    index('rflct_codes_created_at_idx').on(table.createdAt),
  ]
);

export type RFLCTCode = typeof rflctCodes.$inferSelect;
export type NewRFLCTCode = typeof rflctCodes.$inferInsert;
