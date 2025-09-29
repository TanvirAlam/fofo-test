export const REGEX = {
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  LOWERCASE: /[a-z]/,
  UPPERCASE: /[A-Z]/,
  NUMBER: /\d/,
  SPECIAL: /[@$!%*?&]/,
};

export const DEVELOPMENT = 'development';
export const PRODUCTION = 'production';

export const SECOND = 1000;
export const MINUTE = 60 * 1000;
export const HOUR = 60 * MINUTE;

export const MB = 1024 * 1024;
export const GB = MB * 1024;
export const ROLES = {
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};
