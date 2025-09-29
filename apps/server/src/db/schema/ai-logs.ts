import {
  pgTable,
  uuid,
  timestamp,
  text,
  numeric,
  index,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { tenants, locations } from './tenants';

export const aiCallLogs = pgTable(
  'ai_call_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tokenUsage: numeric('token_usage').notNull(),
    model: text('model').notNull(),
    tenantId: uuid('tenant_id').references(() => tenants.id),
    locationId: uuid('location_id').references(() => locations.id),
    userId: text('user_id').references(() => users.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('ai_call_logs_tenant_idx').on(table.tenantId),
    index('ai_call_logs_location_idx').on(table.locationId),
    index('ai_call_logs_user_idx').on(table.userId),
    index('ai_call_logs_model_idx').on(table.model),
    index('ai_call_logs_created_at_idx').on(table.createdAt),
  ]
);

export type AiCallLog = typeof aiCallLogs.$inferSelect;
export type NewAiCallLog = typeof aiCallLogs.$inferInsert;
