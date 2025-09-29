import {
  pgTable,
  uuid,
  timestamp,
  text,
  jsonb,
  boolean,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const tenants = pgTable(
  'tenants',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    logo: text('logo'),
    favicon: text('favicon'),
    primaryColor: text('primary_color'),
    secondaryColor: text('secondary_color'),
    primaryFont: text('primary_font'),
    websiteUrl: text('website_url'),
    businessHours: jsonb('business_hours'),
    isActive: boolean('is_active').notNull().default(true),
    ownerId: text('owner_id').references(() => users.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    uniqueIndex('tenants_name_idx').on(table.name),
    index('tenants_owner_idx').on(table.ownerId),
    index('tenants_is_active_idx').on(table.isActive),
    index('tenants_created_at_idx').on(table.createdAt),
  ]
);

export const locations = pgTable(
  'locations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    address: text('address').notNull(),
    tenantId: uuid('tenant_id').references(() => tenants.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('locations_tenant_idx').on(table.tenantId),
    index('locations_created_by_idx').on(table.createdBy),
    index('locations_created_at_idx').on(table.createdAt),
  ]
);

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;

export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
