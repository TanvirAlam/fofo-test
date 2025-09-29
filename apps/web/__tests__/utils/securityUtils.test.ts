import { SecurityUtils } from "../../src/utils/securityUtils";

describe("SecurityUtils", () => {
  describe("sanitizeInput", () => {
    test("should sanitize HTML special characters", () => {
      const maliciousInput = '<script>alert("XSS")</script>';
      const sanitized = SecurityUtils.sanitizeInput(maliciousInput);
      expect(sanitized).toBe(
        "&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;"
      );
    });

    test("should handle empty string", () => {
      expect(SecurityUtils.sanitizeInput("")).toBe("");
    });

    test("should handle string without special characters", () => {
      const normalInput = "Hello World 123";
      expect(SecurityUtils.sanitizeInput(normalInput)).toBe(normalInput);
    });

    test("should sanitize all HTML entities in complex string", () => {
      const input = '<div class="test">\'Hello\' & "World"</div>';
      const expected =
        "&lt;div class=&quot;test&quot;&gt;&#x27;Hello&#x27; &amp; &quot;World&quot;&lt;&#x2F;div&gt;";
      expect(SecurityUtils.sanitizeInput(input)).toBe(expected);
    });

    test("should handle strings with only special characters", () => {
      const input = "<>\"'/";
      const expected = "&lt;&gt;&quot;&#x27;&#x2F;";
      expect(SecurityUtils.sanitizeInput(input)).toBe(expected);
    });
  });

  describe("isValidRedirectUrl", () => {
    const allowedDomains = [
      "example.com",
      "subdomain.example.com",
      "foodime.com",
    ];

    test("should allow valid URLs with allowed domains", () => {
      expect(
        SecurityUtils.isValidRedirectUrl(
          "https://example.com/path",
          allowedDomains
        )
      ).toBe(true);
      expect(
        SecurityUtils.isValidRedirectUrl(
          "http://subdomain.example.com",
          allowedDomains
        )
      ).toBe(true);
      expect(
        SecurityUtils.isValidRedirectUrl(
          "https://foodime.com/dashboard",
          allowedDomains
        )
      ).toBe(true);
    });

    test("should reject URLs with disallowed domains", () => {
      expect(
        SecurityUtils.isValidRedirectUrl(
          "https://malicious.com",
          allowedDomains
        )
      ).toBe(false);
      expect(
        SecurityUtils.isValidRedirectUrl(
          "http://evil.example.com.malicious.com",
          allowedDomains
        )
      ).toBe(false);
    });

    test("should reject invalid URL formats", () => {
      expect(
        SecurityUtils.isValidRedirectUrl("not-a-url", allowedDomains)
      ).toBe(false);
      expect(
        SecurityUtils.isValidRedirectUrl("javascript:alert(1)", allowedDomains)
      ).toBe(false);
      expect(
        SecurityUtils.isValidRedirectUrl(
          "data:text/html,<script>",
          allowedDomains
        )
      ).toBe(false);
    });

    test("should handle empty allowed domains array", () => {
      expect(SecurityUtils.isValidRedirectUrl("https://example.com", [])).toBe(
        false
      );
    });

    test("should handle malformed URLs gracefully", () => {
      expect(SecurityUtils.isValidRedirectUrl("https://", allowedDomains)).toBe(
        false
      );
      expect(
        SecurityUtils.isValidRedirectUrl("://invalid", allowedDomains)
      ).toBe(false);
    });

    test("should handle domain case normalization", () => {
      // URLs are normalized to lowercase by the URL constructor
      const mixedCaseDomains = ["Example.com"];
      const lowerCaseDomains = ["example.com"];

      // Both should fail because URL normalizes to lowercase
      expect(
        SecurityUtils.isValidRedirectUrl(
          "https://example.com",
          mixedCaseDomains
        )
      ).toBe(false);
      expect(
        SecurityUtils.isValidRedirectUrl(
          "https://Example.com",
          mixedCaseDomains
        )
      ).toBe(false);

      // This should work because domain list matches normalized hostname
      expect(
        SecurityUtils.isValidRedirectUrl(
          "https://Example.com",
          lowerCaseDomains
        )
      ).toBe(true);
    });
  });

  describe("generateNonce", () => {
    test("should generate a non-empty string", () => {
      const nonce = SecurityUtils.generateNonce();
      expect(nonce).toBeTruthy();
      expect(typeof nonce).toBe("string");
      expect(nonce.length).toBeGreaterThan(0);
    });

    test("should generate unique nonces", () => {
      const nonce1 = SecurityUtils.generateNonce();
      const nonce2 = SecurityUtils.generateNonce();
      expect(nonce1).not.toBe(nonce2);
    });

    test("should generate base64 encoded strings", () => {
      const nonce = SecurityUtils.generateNonce();
      // Base64 regex pattern
      const base64Pattern = /^[A-Za-z0-9+/]+=*$/;
      expect(base64Pattern.test(nonce)).toBe(true);
    });

    test("should generate consistent length nonces", () => {
      const nonces = Array.from({ length: 10 }, () =>
        SecurityUtils.generateNonce()
      );
      const lengths = nonces.map(n => n.length);
      // All lengths should be the same
      expect(new Set(lengths).size).toBe(1);
    });
  });

  describe("isAllowedFileType", () => {
    const allowedTypes = ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"];

    test("should allow files with permitted extensions", () => {
      expect(SecurityUtils.isAllowedFileType("image.jpg", allowedTypes)).toBe(
        true
      );
      expect(
        SecurityUtils.isAllowedFileType("document.pdf", allowedTypes)
      ).toBe(true);
      expect(SecurityUtils.isAllowedFileType("file.PNG", allowedTypes)).toBe(
        true
      ); // case insensitive
    });

    test("should reject files with forbidden extensions", () => {
      expect(SecurityUtils.isAllowedFileType("malware.exe", allowedTypes)).toBe(
        false
      );
      expect(SecurityUtils.isAllowedFileType("script.js", allowedTypes)).toBe(
        false
      );
      expect(SecurityUtils.isAllowedFileType("shell.sh", allowedTypes)).toBe(
        false
      );
    });

    test("should handle files without extensions", () => {
      expect(SecurityUtils.isAllowedFileType("filename", allowedTypes)).toBe(
        false
      );
      expect(SecurityUtils.isAllowedFileType("", allowedTypes)).toBe(false);
    });

    test("should be case insensitive", () => {
      expect(SecurityUtils.isAllowedFileType("IMAGE.JPG", allowedTypes)).toBe(
        true
      );
      expect(
        SecurityUtils.isAllowedFileType("document.PDF", allowedTypes)
      ).toBe(true);
    });

    test("should handle complex filenames", () => {
      expect(
        SecurityUtils.isAllowedFileType("my.file.with.dots.jpg", allowedTypes)
      ).toBe(true);
      expect(
        SecurityUtils.isAllowedFileType("path/to/file.pdf", allowedTypes)
      ).toBe(true);
    });

    test("should handle empty allowed types array", () => {
      expect(SecurityUtils.isAllowedFileType("file.jpg", [])).toBe(false);
    });

    test("should handle filenames ending with dots", () => {
      expect(SecurityUtils.isAllowedFileType("file.", allowedTypes)).toBe(
        false
      );
      expect(SecurityUtils.isAllowedFileType("file..", allowedTypes)).toBe(
        false
      );
    });
  });
});
