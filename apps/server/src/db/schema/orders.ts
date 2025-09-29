import { pgTable, uuid, timestamp, text, index } from 'drizzle-orm/pg-core';
import { users } from './users';
import { tenants, locations } from './tenants';
import { itemVariants, menuItems } from './menus';

export const crmContacts = pgTable(
  'crm_contacts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id),
    userId: text('user_id').references(() => users.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('crm_contacts_tenant_idx').on(table.tenantId),
    index('crm_contacts_user_idx').on(table.userId),
    index('crm_contacts_created_at_idx').on(table.createdAt),
  ]
);

export const orders = pgTable(
  'orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    customerId: text('customer_id').references(() => users.id),
    locationId: uuid('location_id').references(() => locations.id),
    tenantId: uuid('tenant_id').references(() => tenants.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('orders_customer_idx').on(table.customerId),
    index('orders_location_idx').on(table.locationId),
    index('orders_tenant_idx').on(table.tenantId),
    index('orders_created_at_idx').on(table.createdAt),
  ]
);

export const orderItems = pgTable(
  'order_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id').references(() => orders.id),
    menuItemId: uuid('menu_item_id').references(() => menuItems.id),
    itemVariantId: uuid('item_variant_id').references(() => itemVariants.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('order_items_order_idx').on(table.orderId),
    index('order_items_menu_item_idx').on(table.menuItemId),
    index('order_items_item_variant_idx').on(table.itemVariantId),
    index('order_items_created_at_idx').on(table.createdAt),
  ]
);

export const orderItemOptions = pgTable(
  'order_item_options',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orderItemId: uuid('order_item_id').references(() => orderItems.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('order_item_options_order_item_idx').on(table.orderItemId),
    index('order_item_options_created_at_idx').on(table.createdAt),
  ]
);

export type CrmContact = typeof crmContacts.$inferSelect;
export type NewCrmContact = typeof crmContacts.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;

export type OrderItemOption = typeof orderItemOptions.$inferSelect;
export type NewOrderItemOption = typeof orderItemOptions.$inferInsert;
