import { emailRegex, phoneRegex, cvrRegex } from "../../src/utils/regex";
import { SecurityUtils } from "../../src/utils/securityUtils";
import { DENMARKCODE } from "../../src/utils/common";

describe("Form Validation Integration", () => {
  describe("Complete User Registration Flow", () => {
    test("should validate complete valid user registration", () => {
      const validRegistrationData = {
        email: "user@example.com",
        phone: "12345678",
        cvr: "87654321",
        businessName: "Clean Business Name",
      };

      expect(emailRegex.test(validRegistrationData.email)).toBe(true);
      expect(phoneRegex.test(validRegistrationData.phone)).toBe(true);
      expect(cvrRegex.test(validRegistrationData.cvr)).toBe(true);

      // Business name should be safe after sanitization
      const sanitizedName = SecurityUtils.sanitizeInput(
        validRegistrationData.businessName
      );
      expect(sanitizedName).toBe(validRegistrationData.businessName);
    });

    test("should reject registration with invalid email", () => {
      const invalidEmailData = {
        email: "invalid-email",
        phone: "12345678",
        cvr: "87654321",
      };

      expect(emailRegex.test(invalidEmailData.email)).toBe(false);
      expect(phoneRegex.test(invalidEmailData.phone)).toBe(true);
      expect(cvrRegex.test(invalidEmailData.cvr)).toBe(true);
    });

    test("should reject registration with invalid phone", () => {
      const invalidPhoneData = {
        email: "user@example.com",
        phone: "123", // Too short
        cvr: "87654321",
      };

      expect(emailRegex.test(invalidPhoneData.email)).toBe(true);
      expect(phoneRegex.test(invalidPhoneData.phone)).toBe(false);
      expect(cvrRegex.test(invalidPhoneData.cvr)).toBe(true);
    });

    test("should reject registration with invalid CVR", () => {
      const invalidCVRData = {
        email: "user@example.com",
        phone: "12345678",
        cvr: "123", // Too short
      };

      expect(emailRegex.test(invalidCVRData.email)).toBe(true);
      expect(phoneRegex.test(invalidCVRData.phone)).toBe(true);
      expect(cvrRegex.test(invalidCVRData.cvr)).toBe(false);
    });
  });

  describe("Phone Number with Country Code", () => {
    test("should handle Danish phone numbers correctly", () => {
      const phoneWithCountryCode = "+4512345678";
      const phoneOnly = "12345678";

      // Current regex only validates the number part
      expect(phoneRegex.test(phoneOnly)).toBe(true);
      expect(phoneRegex.test(phoneWithCountryCode)).toBe(false); // Contains + and country code

      // But we can validate by extracting the number part
      const extractedNumber = phoneWithCountryCode.startsWith(DENMARKCODE)
        ? phoneWithCountryCode.slice(DENMARKCODE.length)
        : phoneWithCountryCode;

      expect(phoneRegex.test(extractedNumber)).toBe(true);
      expect(extractedNumber).toBe(phoneOnly);
    });
  });

  describe("Security Integration", () => {
    test("should sanitize malicious input in form fields", () => {
      const maliciousFormData = {
        businessName: '<script>alert("xss")</script>My Business',
        email: "user@example.com",
        phone: "12345678",
      };

      const sanitizedBusinessName = SecurityUtils.sanitizeInput(
        maliciousFormData.businessName
      );

      expect(sanitizedBusinessName).toBe(
        "&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;My Business"
      );
      expect(sanitizedBusinessName).not.toContain("<script>");
      expect(emailRegex.test(maliciousFormData.email)).toBe(true);
      expect(phoneRegex.test(maliciousFormData.phone)).toBe(true);
    });

    test("should validate file uploads securely", () => {
      const fileUploads = [
        { name: "logo.jpg", allowed: ["jpg", "png", "gif"] },
        { name: "malware.exe", allowed: ["jpg", "png", "gif"] },
        { name: "document.pdf", allowed: ["pdf", "doc", "docx"] },
      ];

      expect(
        SecurityUtils.isAllowedFileType(
          fileUploads[0].name,
          fileUploads[0].allowed
        )
      ).toBe(true);
      expect(
        SecurityUtils.isAllowedFileType(
          fileUploads[1].name,
          fileUploads[1].allowed
        )
      ).toBe(false);
      expect(
        SecurityUtils.isAllowedFileType(
          fileUploads[2].name,
          fileUploads[2].allowed
        )
      ).toBe(true);
    });

    test("should validate redirect URLs safely", () => {
      const redirectScenarios = [
        {
          url: "https://foodime.com/dashboard",
          allowedDomains: ["foodime.com", "app.foodime.com"],
          expected: true,
        },
        {
          url: "https://malicious.com",
          allowedDomains: ["foodime.com", "app.foodime.com"],
          expected: false,
        },
        {
          url: "javascript:alert(1)",
          allowedDomains: ["foodime.com"],
          expected: false,
        },
      ];

      redirectScenarios.forEach(scenario => {
        expect(
          SecurityUtils.isValidRedirectUrl(
            scenario.url,
            scenario.allowedDomains
          )
        ).toBe(scenario.expected);
      });
    });
  });

  describe("Error Handling Integration", () => {
    test("should handle validation errors gracefully", () => {
      const invalidData = {
        email: "",
        phone: "",
        cvr: "",
      };

      const validationResults = {
        email: emailRegex.test(invalidData.email),
        phone: phoneRegex.test(invalidData.phone),
        cvr: cvrRegex.test(invalidData.cvr),
      };

      expect(validationResults.email).toBe(false);
      expect(validationResults.phone).toBe(false);
      expect(validationResults.cvr).toBe(false);

      // Should have failed validation for all fields
      const failedFields = Object.entries(validationResults)
        .filter(([, isValid]) => !isValid)
        .map(([field]) => field);

      expect(failedFields).toEqual(["email", "phone", "cvr"]);
    });
  });

  describe("Real-world Scenarios", () => {
    test("should handle Danish business registration scenario", () => {
      const danishBusiness = {
        email: "owner@pizzashop.dk",
        phone: "20123456", // Danish mobile format
        cvr: "12345678",
        businessName: "Mario's Pizza & Pasta",
      };

      expect(emailRegex.test(danishBusiness.email)).toBe(true);
      expect(phoneRegex.test(danishBusiness.phone)).toBe(true);
      expect(cvrRegex.test(danishBusiness.cvr)).toBe(true);

      const sanitizedName = SecurityUtils.sanitizeInput(
        danishBusiness.businessName
      );
      expect(sanitizedName).toBe("Mario&#x27;s Pizza &amp; Pasta");
    });

    test("should handle international email with Danish business", () => {
      const internationalOwner = {
        email: "owner@global-franchise.com",
        phone: "45123456", // Different format but still valid
        cvr: "98765432",
      };

      expect(emailRegex.test(internationalOwner.email)).toBe(true);
      expect(phoneRegex.test(internationalOwner.phone)).toBe(true);
      expect(cvrRegex.test(internationalOwner.cvr)).toBe(true);
    });
  });
});
