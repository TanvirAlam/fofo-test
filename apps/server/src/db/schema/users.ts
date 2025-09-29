import {
  pgTable,
  text,
  boolean,
  timestamp,
  pgEnum,
  index,
  uniqueIndex,
  integer,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { restaurants } from './restaurants';

export const userRoleEnum = pgEnum('user_role', [
  'STAFF',
  'MANAGER',
  'ADMIN',
  'SUPER_ADMIN',
]);

export const users = pgTable(
  'users',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    email: text('email').notNull(),
    fullName: text('full_name').notNull(),
    phone: text('phone'),
    avatarUrl: text('avatar_url'),
    restaurantId: text('restaurant_id').references(() => restaurants.id),
    passwordHash: text('password_hash').notNull(),
    cvrNumber: integer('cvr_number').notNull(),
    role: userRoleEnum('role').notNull(),
    auth0Id: text('auth0_id').notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    status: text('status').notNull().default('PENDING'),
    isVerified: boolean('is_verified').notNull().default(false),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    uniqueIndex('users_email_idx').on(table.email),
    uniqueIndex('users_auth0_id_idx').on(table.auth0Id),
    index('users_phone_idx').on(table.phone),
    index('users_role_idx').on(table.role),
    index('users_is_active_idx').on(table.isActive),
    index('users_created_at_idx').on(table.createdAt),
  ]
);

export const usersRelations = relations(users, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [users.restaurantId],
    references: [restaurants.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
