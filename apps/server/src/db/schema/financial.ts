import {
  pgTable,
  uuid,
  timestamp,
  text,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { plans } from './plans';

export const costComponents = pgTable(
  'cost_components',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    uniqueIndex('cost_components_name_idx').on(table.name),
    index('cost_components_created_at_idx').on(table.createdAt),
  ]
);

export const planCosts = pgTable(
  'plan_costs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    planId: uuid('plan_id').references(() => plans.id),
    costComponentId: uuid('cost_component_id').references(
      () => costComponents.id
    ),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('plan_costs_plan_idx').on(table.planId),
    index('plan_costs_component_idx').on(table.costComponentId),
    index('plan_costs_created_at_idx').on(table.createdAt),
  ]
);

export const revenueSnapshots = pgTable(
  'revenue_snapshots',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    planId: uuid('plan_id').references(() => plans.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('revenue_snapshots_plan_idx').on(table.planId),
    index('revenue_snapshots_created_at_idx').on(table.createdAt),
  ]
);

export const marginSnapshots = pgTable(
  'margin_snapshots',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    planId: uuid('plan_id').references(() => plans.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('margin_snapshots_plan_idx').on(table.planId),
    index('margin_snapshots_created_at_idx').on(table.createdAt),
  ]
);

export const slaTiers = pgTable(
  'sla_tiers',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    planId: uuid('plan_id').references(() => plans.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('sla_tiers_plan_idx').on(table.planId),
    index('sla_tiers_created_at_idx').on(table.createdAt),
  ]
);

export type CostComponent = typeof costComponents.$inferSelect;
export type NewCostComponent = typeof costComponents.$inferInsert;
export type PlanCost = typeof planCosts.$inferSelect;
export type NewPlanCost = typeof planCosts.$inferInsert;
export type RevenueSnapshot = typeof revenueSnapshots.$inferSelect;
export type NewRevenueSnapshot = typeof revenueSnapshots.$inferInsert;
export type MarginSnapshot = typeof marginSnapshots.$inferSelect;
export type NewMarginSnapshot = typeof marginSnapshots.$inferInsert;
export type SlaTier = typeof slaTiers.$inferSelect;
export type NewSlaTier = typeof slaTiers.$inferInsert;
