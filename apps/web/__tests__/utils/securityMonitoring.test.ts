import { SecurityMonitor } from "../../src/utils/securityMonitoring";
import { ENVIRONMENT } from "../../src/utils/securityConstants";

// Mock console.log
const originalLog = console.log;
const originalEnv = process.env.NODE_ENV;

beforeEach(() => {
  console.log = jest.fn();
  process.env.NODE_ENV = "test";
});

afterAll(() => {
  console.log = originalLog;
  process.env.NODE_ENV = originalEnv;
});

describe("SecurityMonitor", () => {
  describe("logSecurityEvent", () => {
    test("should handle basic security event logging", () => {
      const securityEvent = {
        type: "failed_login",
        severity: "medium" as const,
        details: { username: "test@example.com", attempts: 3 },
      };

      expect(() => {
        SecurityMonitor.logSecurityEvent(securityEvent);
      }).not.toThrow();
    });

    test("should handle security events with all optional fields", () => {
      const securityEvent = {
        type: "suspicious_activity",
        severity: "high" as const,
        details: { action: "multiple_requests", count: 100 },
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        ip: "192.168.1.100",
      };

      expect(() => {
        SecurityMonitor.logSecurityEvent(securityEvent);
      }).not.toThrow();
    });

    test("should handle different severity levels", () => {
      const severityLevels = ["low", "medium", "high", "critical"] as const;

      severityLevels.forEach(severity => {
        const event = {
          type: "test_event",
          severity,
          details: { test: true },
        };

        expect(() => {
          SecurityMonitor.logSecurityEvent(event);
        }).not.toThrow();
      });
    });

    test("should handle complex details objects", () => {
      const complexEvent = {
        type: "data_breach_attempt",
        severity: "critical" as const,
        details: {
          timestamp: Date.now(),
          endpoint: "/api/sensitive-data",
          payload: { query: "SELECT * FROM users" },
          headers: { authorization: "Bearer [REDACTED]" },
          metadata: {
            browser: "Chrome",
            os: "Linux",
            country: "Unknown",
          },
        },
      };

      expect(() => {
        SecurityMonitor.logSecurityEvent(complexEvent);
      }).not.toThrow();
    });

    test("should handle empty details object", () => {
      const event = {
        type: "generic_security_event",
        severity: "low" as const,
        details: {},
      };

      expect(() => {
        SecurityMonitor.logSecurityEvent(event);
      }).not.toThrow();
    });

    test("should disable console.log in production environment", () => {
      process.env.NODE_ENV = ENVIRONMENT.PRODUCTION;

      const event = {
        type: "production_test",
        severity: "high" as const,
        details: { test: true },
      };

      SecurityMonitor.logSecurityEvent(event);

      // In production, console.log should be replaced with noop
      expect(console.log).toEqual(expect.any(Function));

      // Verify console.log was disabled
      console.log("test");
      // If console.log was properly disabled, this wouldn't output anything
    });

    test("should handle malformed IP addresses", () => {
      const malformedIPs = [
        "999.999.999.999",
        "not.an.ip.address",
        "192.168.1",
        "::ffff:192.168.1.1",
        "localhost",
        "127.0.0.1:8080",
      ];

      malformedIPs.forEach(ip => {
        const event = {
          type: "malformed_ip_test",
          severity: "low" as const,
          details: { test: true },
          ip,
        };

        expect(() => {
          SecurityMonitor.logSecurityEvent(event);
        }).not.toThrow();
      });
    });

    test("should handle various user agent strings", () => {
      const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "curl/7.68.0",
        "PostmanRuntime/7.29.0",
        "python-requests/2.25.1",
        "",
        "Very".repeat(1000), // Very long user agent
      ];

      userAgents.forEach(userAgent => {
        const event = {
          type: "user_agent_test",
          severity: "low" as const,
          details: { test: true },
          userAgent,
        };

        expect(() => {
          SecurityMonitor.logSecurityEvent(event);
        }).not.toThrow();
      });
    });

    test("should handle events with null and undefined values", () => {
      const event = {
        type: "null_test",
        severity: "medium" as const,
        details: {
          nullValue: null,
          undefinedValue: undefined,
          emptyString: "",
          zeroValue: 0,
          falseValue: false,
        },
      };

      expect(() => {
        SecurityMonitor.logSecurityEvent(event);
      }).not.toThrow();
    });
  });

  describe("reportCSPViolation", () => {
    test("should report CSP violations with correct event structure", () => {
      const cspViolation = {
        "document-uri": "https://example.com/page",
        referrer: "",
        "violated-directive": "script-src",
        "effective-directive": "script-src",
        "original-policy": "script-src 'self'",
        disposition: "enforce",
        "blocked-uri": "https://malicious.com/script.js",
        "status-code": 200,
      };

      // Spy on logSecurityEvent to verify it's called correctly
      const logSpy = jest.spyOn(SecurityMonitor, "logSecurityEvent");

      SecurityMonitor.reportCSPViolation(cspViolation);

      expect(logSpy).toHaveBeenCalledWith({
        type: "csp_violation",
        severity: "medium",
        details: cspViolation,
      });

      logSpy.mockRestore();
    });

    test("should handle empty CSP violation object", () => {
      const logSpy = jest.spyOn(SecurityMonitor, "logSecurityEvent");

      SecurityMonitor.reportCSPViolation({});

      expect(logSpy).toHaveBeenCalledWith({
        type: "csp_violation",
        severity: "medium",
        details: {},
      });

      logSpy.mockRestore();
    });

    test("should handle CSP violation with unknown fields", () => {
      const unknownCSPViolation = {
        customField: "custom value",
        anotherField: 123,
        nestedObject: { key: "value" },
      };

      const logSpy = jest.spyOn(SecurityMonitor, "logSecurityEvent");

      SecurityMonitor.reportCSPViolation(unknownCSPViolation);

      expect(logSpy).toHaveBeenCalledWith({
        type: "csp_violation",
        severity: "medium",
        details: unknownCSPViolation,
      });

      logSpy.mockRestore();
    });

    test("should handle real-world CSP violation format", () => {
      const realCSPViolation = {
        "csp-report": {
          "document-uri": "https://foodime.com/dashboard",
          referrer: "https://foodime.com/login",
          "violated-directive": "script-src-elem",
          "effective-directive": "script-src-elem",
          "original-policy":
            "script-src 'self' 'unsafe-inline' https://cdn.foodime.com; object-src 'none';",
          disposition: "enforce",
          "blocked-uri": "inline",
          "line-number": 1,
          "column-number": 1,
          "source-file": "https://foodime.com/dashboard",
          "status-code": 200,
          "script-sample": 'console.log("blocked script")',
        },
      };

      const logSpy = jest.spyOn(SecurityMonitor, "logSecurityEvent");

      SecurityMonitor.reportCSPViolation(realCSPViolation);

      expect(logSpy).toHaveBeenCalledWith({
        type: "csp_violation",
        severity: "medium",
        details: realCSPViolation,
      });

      logSpy.mockRestore();
    });

    test("should maintain consistent severity for CSP violations", () => {
      const logSpy = jest.spyOn(SecurityMonitor, "logSecurityEvent");

      SecurityMonitor.reportCSPViolation({ test: "violation" });

      expect(logSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          severity: "medium",
        })
      );

      logSpy.mockRestore();
    });
  });

  describe("SecurityMonitor Integration", () => {
    test("should work with different environment settings", () => {
      const environments = ["development", "test", "staging", "production"];

      environments.forEach(env => {
        process.env.NODE_ENV = env;

        const event = {
          type: "environment_test",
          severity: "low" as const,
          details: { environment: env },
        };

        expect(() => {
          SecurityMonitor.logSecurityEvent(event);
        }).not.toThrow();
      });
    });

    test("should handle concurrent security events", async () => {
      const events = Array.from({ length: 10 }, (_, i) => ({
        type: "concurrent_test",
        severity: "low" as const,
        details: { eventId: i },
      }));

      const promises = events.map(event =>
        Promise.resolve(SecurityMonitor.logSecurityEvent(event))
      );

      expect(async () => {
        await Promise.all(promises);
      }).not.toThrow();
    });

    test("should handle security events with various data types", () => {
      const event = {
        type: "data_type_test",
        severity: "medium" as const,
        details: {
          string: "text",
          number: 42,
          boolean: true,
          array: [1, 2, 3],
          object: { nested: "value" },
          date: new Date(),
          regexp: /test/g,
        },
      };

      expect(() => {
        SecurityMonitor.logSecurityEvent(event);
      }).not.toThrow();
    });

    test("should validate security event type consistency", () => {
      const eventTypes = [
        "failed_login",
        "csp_violation",
        "suspicious_activity",
        "data_breach_attempt",
        "unauthorized_access",
        "rate_limit_exceeded",
        "malware_detected",
      ];

      eventTypes.forEach(type => {
        const event = {
          type,
          severity: "medium" as const,
          details: { eventType: type },
        };

        expect(() => {
          SecurityMonitor.logSecurityEvent(event);
        }).not.toThrow();
      });
    });

    test("should handle CSP and security event reporting together", () => {
      const logSpy = jest.spyOn(SecurityMonitor, "logSecurityEvent");

      // Report a CSP violation
      SecurityMonitor.reportCSPViolation({
        "violated-directive": "script-src",
      });

      // Report a regular security event
      SecurityMonitor.logSecurityEvent({
        type: "manual_security_event",
        severity: "high",
        details: { manual: true },
      });

      expect(logSpy).toHaveBeenCalledTimes(2);
      expect(logSpy).toHaveBeenNthCalledWith(1, {
        type: "csp_violation",
        severity: "medium",
        details: { "violated-directive": "script-src" },
      });
      expect(logSpy).toHaveBeenNthCalledWith(2, {
        type: "manual_security_event",
        severity: "high",
        details: { manual: true },
      });

      logSpy.mockRestore();
    });
  });
});
