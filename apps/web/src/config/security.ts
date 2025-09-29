import { CSP_KEYWORD, ENVIRONMENT } from "../utils/securityConstants";

interface SecurityConfig {
  csp: {
    enabled: boolean;
    reportOnly: boolean;
    directives: Record<string, string[]>;
  };
  headers: {
    hsts: boolean;
    frameOptions: string;
    contentTypeOptions: boolean;
  };
}

const securityConfig: SecurityConfig = {
  csp: {
    enabled: true,
    reportOnly: process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION,
    directives: {
      "default-src": [CSP_KEYWORD.SELF],
      "script-src": [
        CSP_KEYWORD.SELF,
        process.env.NODE_ENV === ENVIRONMENT.DEVELOPMENT
          ? CSP_KEYWORD.UNSAFE_EVAL
          : "",
      ].filter(Boolean),
      "style-src": [CSP_KEYWORD.SELF, CSP_KEYWORD.UNSAFE_INLINE],
      "font-src": [CSP_KEYWORD.SELF],
      "img-src": [CSP_KEYWORD.SELF, "data:", "blob:", "https:"],
      "media-src": [CSP_KEYWORD.SELF, "blob:", "https:"],
      "connect-src": [
        CSP_KEYWORD.SELF,

        process.env.NODE_ENV === ENVIRONMENT.DEVELOPMENT
          ? "ws://localhost:*"
          : "",
      ].filter(Boolean),
      "frame-src": [CSP_KEYWORD.NONE],
      "object-src": [CSP_KEYWORD.NONE],
      "base-uri": [CSP_KEYWORD.SELF],
      "form-action": [CSP_KEYWORD.SELF],
      "frame-ancestors": [CSP_KEYWORD.NONE],
      "upgrade-insecure-requests": [],
    },
  },
  headers: {
    hsts: process.env.NODE_ENV === ENVIRONMENT.PRODUCTION,
    frameOptions: "DENY",
    contentTypeOptions: true,
  },
};

export default securityConfig;
