import { NextResponse } from "next/server";
import { ENVIRONMENT } from "./utils/securityConstants";

export function middleware() {
  const cspPolicy = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' ",
    "style-src 'self' 'unsafe-inline' ",
    "font-src 'self' ",
    "img-src 'self' data: blob: https:",
    "media-src 'self'",
    "connect-src 'self' ",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");

  const response = NextResponse.next();

  response.headers.set("Content-Security-Policy", cspPolicy);

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  if (process.env.NODE_ENV === ENVIRONMENT.PRODUCTION) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
