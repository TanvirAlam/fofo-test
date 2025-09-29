import { emailRegex, phoneRegex, cvrRegex } from "../../src/utils/regex";

describe("Regex Validators", () => {
  describe("emailRegex", () => {
    test("should validate correct email formats", () => {
      const validEmails = [
        "test@example.com",
        "user.name@domain.co.uk",
        "test123@test-domain.com",
        "user+tag@example.org",
        "user_name@example-site.info",
        "first.last@subdomain.example.com",
        "user123@example123.com",
        "test@example.technology",
      ];

      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true);
      });
    });

    test("should reject invalid email formats", () => {
      const invalidEmails = [
        "plainaddress",
        "@missingdomain.com",
        "missing@.com",
        "missing@domain",
        "spaces in@email.com",
        "double@@domain.com",
        "",
        "user@domain.",
        "user@domain.c", // TLD too short
      ];

      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });

    test("should identify current regex limitations", () => {
      // These currently pass but ideally should fail - potential improvements
      const problematicEmails = [
        "toolong@" + "a".repeat(250) + ".com", // Very long domain
        "user@domain..com", // Double dots
        "user@.domain.com", // Leading dot in domain
        ".user@domain.com", // Leading dot in local part
        "user.@domain.com", // Trailing dot in local part
      ];

      problematicEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true); // Currently passes, but might need stricter validation
      });
    });

    test("should handle edge cases", () => {
      // Edge cases that should be valid
      expect(emailRegex.test("a@b.co")).toBe(true); // Minimum valid email
      expect(emailRegex.test("test@example.museum")).toBe(true); // Long TLD

      // Edge cases that should be invalid
      expect(emailRegex.test("test@")).toBe(false); // Missing domain
      expect(emailRegex.test("@example.com")).toBe(false); // Missing local part
    });
  });

  describe("phoneRegex", () => {
    test("should validate correct phone number formats", () => {
      const validPhones = [
        "12345678", // 8 digits
        "123456789", // 9 digits
        "1234567890", // 10 digits
        "12345678901", // 11 digits
        "123456789012", // 12 digits
      ];

      validPhones.forEach(phone => {
        expect(phoneRegex.test(phone)).toBe(true);
      });
    });

    test("should reject invalid phone number formats", () => {
      const invalidPhones = [
        "1234567", // Too short (7 digits)
        "1234567890123", // Too long (13 digits)
        "12345678a", // Contains letters
        "123-456-7890", // Contains dashes
        "+45 12345678", // Contains spaces and country code
        "12 34 56 78", // Contains spaces
        "", // Empty string
        "abcdefgh", // All letters
        "123.456.7890", // Contains dots
      ];

      invalidPhones.forEach(phone => {
        expect(phoneRegex.test(phone)).toBe(false);
      });
    });

    test("should reject repetitive patterns", () => {
      const repetitivePhones = [
        "11111111", // 8 same digits
        "222222222", // 9 same digits
        "3333333333", // 10 same digits
        "44444444444", // 11 same digits
        "555555555555", // 12 same digits
      ];

      repetitivePhones.forEach(phone => {
        expect(phoneRegex.test(phone)).toBe(false);
      });
    });

    test("should allow partial repetitive patterns", () => {
      // These should be valid as they don't match the repetitive pattern exactly
      const validPhones = [
        "11111112", // Only 7 same digits
        "12222222", // Not starting with repetitive
        "11211111", // Interrupted pattern
      ];

      validPhones.forEach(phone => {
        expect(phoneRegex.test(phone)).toBe(true);
      });
    });
  });

  describe("cvrRegex", () => {
    test("should validate correct CVR formats", () => {
      const validCVRs = [
        "12345678",
        "87654321",
        "00000001",
        "99999999",
        "10203040",
      ];

      validCVRs.forEach(cvr => {
        expect(cvrRegex.test(cvr)).toBe(true);
      });
    });

    test("should reject invalid CVR formats", () => {
      const invalidCVRs = [
        "1234567", // Too short (7 digits)
        "123456789", // Too long (9 digits)
        "1234567a", // Contains letters
        "123 45678", // Contains spaces
        "12-34-56-78", // Contains dashes
        "12.34.56.78", // Contains dots
        "", // Empty string
        "abcdefgh", // All letters
        "123456789012", // Way too long
        "0", // Single digit
      ];

      invalidCVRs.forEach(cvr => {
        expect(cvrRegex.test(cvr)).toBe(false);
      });
    });

    test("should handle edge cases", () => {
      expect(cvrRegex.test("00000000")).toBe(true); // All zeros
      expect(cvrRegex.test("12345678")).toBe(true); // Standard format
    });
  });

  describe("Combined validation scenarios", () => {
    test("should handle realistic form validation scenarios", () => {
      // Simulate a complete form validation
      const formData = {
        email: "user@example.com",
        phone: "12345678",
        cvr: "87654321",
      };

      expect(emailRegex.test(formData.email)).toBe(true);
      expect(phoneRegex.test(formData.phone)).toBe(true);
      expect(cvrRegex.test(formData.cvr)).toBe(true);
    });

    test("should reject invalid form data", () => {
      const invalidFormData = {
        email: "invalid-email",
        phone: "123",
        cvr: "123",
      };

      expect(emailRegex.test(invalidFormData.email)).toBe(false);
      expect(phoneRegex.test(invalidFormData.phone)).toBe(false);
      expect(cvrRegex.test(invalidFormData.cvr)).toBe(false);
    });
  });
});
