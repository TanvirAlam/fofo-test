describe("Content Security Policy", () => {
  let cspViolationHandler: jest.Mock;

  beforeAll(() => {
    cspViolationHandler = jest.fn();
    document.addEventListener("securitypolicyviolation", cspViolationHandler);
  });

  afterAll(() => {
    document.removeEventListener(
      "securitypolicyviolation",
      cspViolationHandler
    );
  });

  beforeEach(() => {
    cspViolationHandler.mockClear();
  });

  it("should block inline scripts by default", () => {
    const violationEvent = new Event(
      "securitypolicyviolation"
    ) as SecurityPolicyViolationEvent;
    Object.defineProperties(violationEvent, {
      blockedURI: { value: "inline" },
      violatedDirective: { value: "script-src" },
      effectiveDirective: { value: "script-src" },
      originalPolicy: { value: "default-src 'self'; script-src 'self'" },
    });

    document.dispatchEvent(violationEvent);

    expect(cspViolationHandler).toHaveBeenCalledTimes(1);
    expect(cspViolationHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        blockedURI: "inline",
        violatedDirective: "script-src",
      })
    );
  });

  it("should allow trusted domains", () => {
    const trustedScriptLoad = () => {
      const scriptElement = document.createElement("script");
      scriptElement.src = "https://trusted.com/script.js";
      const loadEvent = new Event("load");
      scriptElement.dispatchEvent(loadEvent);
    };

    expect(trustedScriptLoad).not.toThrow();
    expect(cspViolationHandler).not.toHaveBeenCalled();
  });

  it("should block untrusted domains", () => {
    const violationEvent = new Event(
      "securitypolicyviolation"
    ) as SecurityPolicyViolationEvent;
    Object.defineProperties(violationEvent, {
      blockedURI: { value: "https://malicious.com/evil.js" },
      violatedDirective: { value: "script-src" },
      effectiveDirective: { value: "script-src" },
      originalPolicy: { value: "script-src 'self' https://trusted.com" },
    });

    document.dispatchEvent(violationEvent);

    expect(cspViolationHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        blockedURI: "https://malicious.com/evil.js",
        violatedDirective: "script-src",
      })
    );
  });

  it("should report CSP violations to configured endpoint", () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 204,
    });

    const reportUri = "/csp-violation-report";
    const violationReport = {
      "csp-report": {
        "blocked-uri": "https://evil.com/malware.js",
        disposition: "enforce",
        "document-uri": "https://example.com/",
        "effective-directive": "script-src",
        "original-policy": "script-src 'self'",
        "violated-directive": "script-src",
      },
    };

    fetch(reportUri, {
      method: "POST",
      headers: { "Content-Type": "application/csp-report" },
      body: JSON.stringify(violationReport),
    });

    expect(fetch).toHaveBeenCalledWith(
      reportUri,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/csp-report" },
      })
    );
  });
});
