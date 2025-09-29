import {
  pgTable,
  uuid,
  timestamp,
  text,
  numeric,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const plans = pgTable(
  'plans',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    price: numeric('price').notNull(),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    uniqueIndex('plans_name_idx').on(table.name),
    index('plans_created_by_idx').on(table.createdBy),
    index('plans_created_at_idx').on(table.createdAt),
  ]
);

export const featureCatalog = pgTable(
  'feature_catalog',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    uniqueIndex('feature_catalog_name_idx').on(table.name),
    index('feature_catalog_created_by_idx').on(table.createdBy),
    index('feature_catalog_created_at_idx').on(table.createdAt),
  ]
);

export const planFeatures = pgTable(
  'plan_features',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    planId: uuid('plan_id').references(() => plans.id),
    featureId: uuid('feature_id').references(() => featureCatalog.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('plan_features_plan_idx').on(table.planId),
    index('plan_features_feature_idx').on(table.featureId),
    index('plan_features_created_by_idx').on(table.createdBy),
    index('plan_features_created_at_idx').on(table.createdAt),
  ]
);

export const usageLimits = pgTable(
  'usage_limits',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    planId: uuid('plan_id').references(() => plans.id),
    featureId: uuid('feature_id').references(() => featureCatalog.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('usage_limits_plan_idx').on(table.planId),
    index('usage_limits_feature_idx').on(table.featureId),
    index('usage_limits_created_by_idx').on(table.createdBy),
    index('usage_limits_created_at_idx').on(table.createdAt),
  ]
);

export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;

export type FeatureCatalog = typeof featureCatalog.$inferSelect;
export type NewFeatureCatalog = typeof featureCatalog.$inferInsert;

export type PlanFeature = typeof planFeatures.$inferSelect;
export type NewPlanFeature = typeof planFeatures.$inferInsert;

export type UsageLimit = typeof usageLimits.$inferSelect;
export type NewUsageLimit = typeof usageLimits.$inferInsert;
