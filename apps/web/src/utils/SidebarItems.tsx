import React from "react";
import DashboardIcon from "@/assets/icons/DashboardIcon";
import { ActiveOrdersIcon, RecentOrdersIcon } from "@/assets/icons/OrdersIcon";
import PaymentIcon from "@/assets/icons/PaymentsIcon";
import { AvatarIcon } from "@/assets/icons/avterIcon";
import MenuIcon from "@/assets/icons/MenuIcon";

export const MENU_LABELS = {
  DASHBOARD: "Dashboard",
  ACTIVE_ORDERS: "Active Orders",
  RECENT_ORDERS: "Recent Orders",
  PAYMENTS: "Payments",
  EMPLOYEES: "Employees",
  MENU: "Menu",
} as const;

export type MenuLabel = (typeof MENU_LABELS)[keyof typeof MENU_LABELS];

export type MenuItem = {
  label: MenuLabel;
  icon: React.ReactNode;
};

export const menuItems: MenuItem[] = [
  { label: MENU_LABELS.DASHBOARD, icon: <DashboardIcon /> },
  { label: MENU_LABELS.ACTIVE_ORDERS, icon: <ActiveOrdersIcon /> },
  { label: MENU_LABELS.RECENT_ORDERS, icon: <RecentOrdersIcon /> },
  { label: MENU_LABELS.PAYMENTS, icon: <PaymentIcon /> },
  { label: MENU_LABELS.EMPLOYEES, icon: <AvatarIcon /> },
  { label: MENU_LABELS.MENU, icon: <MenuIcon /> },
];
