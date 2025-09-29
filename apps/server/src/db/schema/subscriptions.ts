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
import { plans } from './plans';

export const subscriptions = pgTable(
  'subscriptions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id),
    planId: uuid('plan_id').references(() => plans.id),
    subscriberId: text('subscriber_id').references(() => users.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('subscriptions_tenant_idx').on(table.tenantId),
    index('subscriptions_plan_idx').on(table.planId),
    index('subscriptions_subscriber_idx').on(table.subscriberId),
    index('subscriptions_created_at_idx').on(table.createdAt),
  ]
);

export const subscriptionLocations = pgTable(
  'subscription_locations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    subscriptionId: uuid('subscription_id').references(() => subscriptions.id),
    locationId: uuid('location_id').references(() => locations.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('subscription_locations_subscription_idx').on(table.subscriptionId),
    index('subscription_locations_location_idx').on(table.locationId),
  ]
);

export const addonsCatalog = pgTable(
  'addons_catalog',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description').default(''),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    uniqueIndex('addons_catalog_name_idx').on(table.name),
    index('addons_catalog_created_at_idx').on(table.createdAt),
  ]
);

export const subscriptionAddons = pgTable(
  'subscription_addons',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description').default(''),
    subscriptionId: uuid('subscription_id').references(() => subscriptions.id),
    addonId: uuid('addon_id').references(() => addonsCatalog.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('subscription_addons_subscription_idx').on(table.subscriptionId),
    index('subscription_addons_addon_idx').on(table.addonId),
    index('subscription_addons_name_idx').on(table.name),
  ]
);

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;

export type SubscriptionLocation = typeof subscriptionLocations.$inferSelect;
export type NewSubscriptionLocation = typeof subscriptionLocations.$inferInsert;

export type AddonsCatalog = typeof addonsCatalog.$inferSelect;
export type NewAddonsCatalog = typeof addonsCatalog.$inferInsert;

export type SubscriptionAddon = typeof subscriptionAddons.$inferSelect;
export type NewSubscriptionAddon = typeof subscriptionAddons.$inferInsert;
