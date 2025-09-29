import {
  pgTable,
  text,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const restaurants = pgTable(
  'restaurants',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    address: text('address').notNull(),
    status: text('status').notNull().default('PENDING'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    uniqueIndex('restaurants_name_idx').on(table.name),
    index('restaurants_status_idx').on(table.status),
    index('restaurants_is_active_idx').on(table.isActive),
  ]
);

export type Restaurant = typeof restaurants.$inferSelect;
