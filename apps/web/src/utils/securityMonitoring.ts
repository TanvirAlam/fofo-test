import { ENVIRONMENT } from "./securityConstants";

export class SecurityMonitor {
  static logSecurityEvent(_event: {
    type: string;
    severity: "low" | "medium" | "high" | "critical";
    details: Record<string, unknown>;
    userAgent?: string;
    ip?: string;
  }) {
    void _event;
    if (process.env.NODE_ENV === ENVIRONMENT.PRODUCTION) {
      console.log = function () {};
    }
  }

  static reportCSPViolation(violation: Record<string, unknown>) {
    this.logSecurityEvent({
      type: "csp_violation",
      severity: "medium",
      details: violation,
    });
  }
}
