import {
  pgTable,
  uuid,
  timestamp,
  text,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { tenants, locations } from './tenants';

export const posVendors = pgTable(
  'pos_vendors',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    uniqueIndex('pos_vendors_name_idx').on(table.name),
    index('pos_vendors_created_by_idx').on(table.createdBy),
    index('pos_vendors_created_at_idx').on(table.createdAt),
  ]
);

export const posIntegrations = pgTable(
  'pos_integrations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id),
    locationId: uuid('location_id').references(() => locations.id),
    vendorId: uuid('vendor_id').references(() => posVendors.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('pos_integrations_tenant_idx').on(table.tenantId),
    index('pos_integrations_location_idx').on(table.locationId),
    index('pos_integrations_vendor_idx').on(table.vendorId),
    index('pos_integrations_created_by_idx').on(table.createdBy),
    index('pos_integrations_created_at_idx').on(table.createdAt),
  ]
);

export type PosVendor = typeof posVendors.$inferSelect;
export type NewPosVendor = typeof posVendors.$inferInsert;

export type PosIntegration = typeof posIntegrations.$inferSelect;
export type NewPosIntegration = typeof posIntegrations.$inferInsert;
