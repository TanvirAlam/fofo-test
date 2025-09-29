export interface BreakPoints {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export const BREAKPOINTS = {
  xs: "320px",
  sm: "576px",
  md: "768px",
  lg: "1024px",
  xl: "1200px",
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;

export const Media: BreakPoints = {
  xs: `@media (min-width: ${BREAKPOINTS.xs})`,
  sm: `@media (min-width: ${BREAKPOINTS.sm})`,
  md: `@media (min-width: ${BREAKPOINTS.md})`,
  lg: `@media (min-width: ${BREAKPOINTS.lg})`,
  xl: `@media (min-width: ${BREAKPOINTS.xl})`,
};
