export const ENVIRONMENT = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
} as const;

export const CSP_KEYWORD = {
  SELF: "'self'",
  NONE: "'none'",
  UNSAFE_INLINE: "'unsafe-inline'",
  UNSAFE_EVAL: "'unsafe-eval'",
} as const;

export type Environment = (typeof ENVIRONMENT)[keyof typeof ENVIRONMENT];
export type CspKeyword = (typeof CSP_KEYWORD)[keyof typeof CSP_KEYWORD];
