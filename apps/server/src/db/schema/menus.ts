import {
  pgTable,
  uuid,
  timestamp,
  text,
  numeric,
  index,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { tenants, locations } from './tenants';

export const menus = pgTable(
  'menus',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').references(() => tenants.id),
    locationId: uuid('location_id').references(() => locations.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('menus_tenant_idx').on(table.tenantId),
    index('menus_location_idx').on(table.locationId),
    index('menus_created_at_idx').on(table.createdAt),
  ]
);

export const menuSections = pgTable(
  'menu_sections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    menuId: uuid('menu_id').references(() => menus.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('menu_sections_menu_idx').on(table.menuId),
    index('menu_sections_created_at_idx').on(table.createdAt),
  ]
);

export const menuItems = pgTable(
  'menu_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    menuSectionId: uuid('menu_section_id').references(() => menuSections.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('menu_items_section_idx').on(table.menuSectionId),
    index('menu_items_name_idx').on(table.name),
    index('menu_items_created_at_idx').on(table.createdAt),
  ]
);

export const itemVariants = pgTable(
  'item_variants',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    menuItemId: uuid('menu_item_id').references(() => menuItems.id),
    name: text('name').notNull(),
    description: text('description'),
    price: numeric('price').notNull(),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('item_variants_menu_item_idx').on(table.menuItemId),
    index('item_variants_name_idx').on(table.name),
    index('item_variants_created_at_idx').on(table.createdAt),
  ]
);

export const itemOptions = pgTable(
  'item_options',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [index('item_options_created_at_idx').on(table.createdAt)]
);

export const optionChoices = pgTable(
  'option_choices',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    itemOptionId: uuid('item_option_id').references(() => itemOptions.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('option_choices_item_option_idx').on(table.itemOptionId),
    index('option_choices_created_at_idx').on(table.createdAt),
  ]
);

export const menuItemOptions = pgTable(
  'menu_item_options',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    menuItemId: uuid('menu_item_id').references(() => menuItems.id),
    itemOptionId: uuid('item_option_id').references(() => itemOptions.id),
    createdBy: text('created_by').references(() => users.id),
    updatedBy: text('updated_by').references(() => users.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  table => [
    index('menu_item_options_menu_item_idx').on(table.menuItemId),
    index('menu_item_options_item_option_idx').on(table.itemOptionId),
    index('menu_item_options_created_at_idx').on(table.createdAt),
  ]
);

export type Menu = typeof menus.$inferSelect;
export type NewMenu = typeof menus.$inferInsert;
export type MenuSection = typeof menuSections.$inferSelect;
export type NewMenuSection = typeof menuSections.$inferInsert;
export type MenuItem = typeof menuItems.$inferSelect;
export type NewMenuItem = typeof menuItems.$inferInsert;
export type ItemVariant = typeof itemVariants.$inferSelect;
export type NewItemVariant = typeof itemVariants.$inferInsert;
export type ItemOption = typeof itemOptions.$inferSelect;
export type NewItemOption = typeof itemOptions.$inferInsert;
export type OptionChoice = typeof optionChoices.$inferSelect;
export type NewOptionChoice = typeof optionChoices.$inferInsert;
export type MenuItemOption = typeof menuItemOptions.$inferSelect;
export type NewMenuItemOption = typeof menuItemOptions.$inferInsert;
