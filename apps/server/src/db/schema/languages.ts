import {
  pgTable,
  uuid,
  timestamp,
  text,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { subscriptions } from './subscriptions';

export const supportedLanguages = pgTable(
  'supported_languages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    code: text('code').notNull(),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    uniqueIndex('supported_languages_name_idx').on(table.name),
    uniqueIndex('supported_languages_code_idx').on(table.code),
    index('supported_languages_created_at_idx').on(table.createdAt),
  ]
);

export const subscriptionLanguages = pgTable(
  'subscription_languages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    subscriptionId: uuid('subscription_id').references(() => subscriptions.id),
    languageId: uuid('language_id').references(() => supportedLanguages.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('subscription_languages_subscription_idx').on(table.subscriptionId),
    index('subscription_languages_language_idx').on(table.languageId),
    index('subscription_languages_created_at_idx').on(table.createdAt),
  ]
);

export type SupportedLanguage = typeof supportedLanguages.$inferSelect;
export type NewSupportedLanguage = typeof supportedLanguages.$inferInsert;

export type SubscriptionLanguage = typeof subscriptionLanguages.$inferSelect;
export type NewSubscriptionLanguage = typeof subscriptionLanguages.$inferInsert;
