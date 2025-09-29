import { pgTable, uuid, timestamp, text, index } from 'drizzle-orm/pg-core';
import { users } from './users';
import { tenants } from './tenants';

export const backups = pgTable(
  'backups',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('backups_tenant_idx').on(table.tenantId),
    index('backups_created_at_idx').on(table.createdAt),
  ]
);

export const branding = pgTable(
  'branding',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('branding_tenant_idx').on(table.tenantId),
    index('branding_created_at_idx').on(table.createdAt),
  ]
);

export type Backup = typeof backups.$inferSelect;
export type NewBackup = typeof backups.$inferInsert;

export type Branding = typeof branding.$inferSelect;
export type NewBranding = typeof branding.$inferInsert;
