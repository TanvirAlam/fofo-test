export enum VIEW_MODES_ENUM {
  DAY = "day",
  MONTH = "month",
  YEAR = "year",
}

export type ViewMode = keyof typeof VIEW_MODES_ENUM | VIEW_MODES_ENUM;

export const DATE_PICKER_CONSTANTS = {
  MONTHS: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ] as const,

  WEEKDAYS: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const,

  VIEW_MODES: VIEW_MODES_ENUM,
};

export const getFullMonthName = (monthIndex: number) =>
  new Date(0, monthIndex).toLocaleString("default", { month: "long" });

export const generateDaysGrid = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];

  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    days.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  return days;
};

export const getPreviousDate = (
  viewMode: ViewMode,
  year: number,
  month: number
) => {
  if (viewMode === VIEW_MODES_ENUM.DAY) return new Date(year, month - 1, 1);
  if (viewMode === VIEW_MODES_ENUM.MONTH) return new Date(year - 1, month, 1);
  return new Date(year - 12, month, 1);
};

export const getNextDate = (
  viewMode: ViewMode,
  year: number,
  month: number
) => {
  if (viewMode === VIEW_MODES_ENUM.DAY) return new Date(year, month + 1, 1);
  if (viewMode === VIEW_MODES_ENUM.MONTH) return new Date(year + 1, month, 1);
  return new Date(year + 12, month, 1);
};
