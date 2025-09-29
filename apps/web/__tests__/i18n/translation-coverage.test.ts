import { render,  } from "@testing-library/react";
import { useTranslation } from "react-i18next";
import React from "react";
import i18n from "../../src/utils/i18n";
import fs from "fs";
import path from "path";

// Mock react-i18next for consistent testing
jest.mock("react-i18next", () => ({
  useTranslation: jest.fn(),
  initReactI18next: {
    type: "3rdParty",
    init: jest.fn(),
  },
}));

describe("i18n Translation Coverage Tests", () => {
  let enTranslations: Record<string, any>;
  let daTranslations: Record<string, any>;

  beforeAll(() => {
    // Load translation files directly for testing
    const enPath = path.join(__dirname, "../../src/locales/en.json");
    const daPath = path.join(__dirname, "../../src/locales/da.json");

    enTranslations = JSON.parse(fs.readFileSync(enPath, "utf-8"));
    daTranslations = JSON.parse(fs.readFileSync(daPath, "utf-8"));
  });

  describe("Translation File Completeness", () => {
    test("should have matching keys between EN and DA translations", () => {
      const enKeys = getAllKeys(enTranslations);
      const daKeys = getAllKeys(daTranslations);

      const missingInDa = enKeys.filter(key => !daKeys.includes(key));
      const missingInEn = daKeys.filter(key => !enKeys.includes(key));

      expect(missingInDa).toEqual([]);
      expect(missingInEn).toEqual([]);
    });

    test("should have no empty translation values", () => {
      const enValues = getAllValues(enTranslations);
      const daValues = getAllValues(daTranslations);

      const emptyEnValues = enValues.filter(
        value => !value || value.trim() === ""
      );
      const emptyDaValues = daValues.filter(
        value => !value || value.trim() === ""
      );

      expect(emptyEnValues).toEqual([]);
      expect(emptyDaValues).toEqual([]);
    });
  });

  describe("Required Translation Keys", () => {
    const requiredKeys = [
      "welcome",
      "disable",
      "manager",
      "fullName",
      "enterName",
      "phoneNumber",
      "enterPhoneNumber",
      "email",
      "enterEmail",
      "restaurantName",
      "enterRestaurantName",
      "restaurantAddress",
      "enterRestaurantAddress",
      "cvrNumber",
      "enterCvrNumber",
      "forgetPasswordTitle",
      "forgetPasswordSubtitle",
      "forgetPasswordMessage",
      "requestPinReset",
      "resetPasswordTitle",
      "resetPasswordMessage",
      "resendPassword",
      "cancel",
      "viaEmail",
      "enterRegisteredEmail",
      "signUp",
      "login",
      "loginText",
      "submitting",
      "done",
      "changeLanguage",
      "managerRegistrationSuccessTitle",
      "managerRegistrationSuccessMessage",
      "managerRegistrationReviewMessage",
      "staffRegistrationSuccessTitle",
      "staffRegistrationSuccessMessage",
      "staffRegistrationReviewMessage",
      // Validation keys
      "validation.required",
      "validation.invalidEmail",
      "validation.invalidPhone",
      "validation.invalidCVR",
    ];

    test.each(requiredKeys)("should have translation key: %s", key => {
      expect(getNestedValue(enTranslations, key)).toBeDefined();
      expect(getNestedValue(daTranslations, key)).toBeDefined();
    });
  });

  describe("Missing Field Translation Keys", () => {
    const expectedFieldKeys = [
      "fields.email",
      "fields.phoneNumber",
      "fields.fullName",
      "fields.restaurantName",
      "fields.restaurantAddress",
      "fields.cvrNumber",
    ];

    test.each(expectedFieldKeys)(
      "should have field translation key: %s",
      key => {
        const enValue = getNestedValue(enTranslations, key);
        const daValue = getNestedValue(daTranslations, key);

        if (!enValue || !daValue) {
          console.warn(`Missing translation key: ${key}`);
          console.warn(
            `Consider adding to translation files for better validation support`
          );
        }

        // This test will initially fail to highlight missing keys
        expect(enValue).toBeDefined();
        expect(daValue).toBeDefined();
      }
    );
  });

  describe("Error Messages and System Text", () => {
    const errorKeys = [
      "error.somethingWentWrong",
      "error.formSubmissionFailed",
      "accessibility.closeModal",
      "accessibility.openModal",
      "system.loading",
      "system.saving",
    ];

    test.each(errorKeys)(
      "should have error/system translation key: %s",
      key => {
        const enValue = getNestedValue(enTranslations, key);
        const daValue = getNestedValue(daTranslations, key);

        if (!enValue || !daValue) {
          console.warn(`Missing system translation key: ${key}`);
          console.warn(`Consider adding for better user experience`);
        }

        // This test will initially fail to highlight missing keys
        expect(enValue).toBeDefined();
        expect(daValue).toBeDefined();
      }
    );
  });

  describe.skip("Hardcoded String Detection", () => {
    test("should not have hardcoded error messages", () => {
      // Check common.ts for hardcoded strings
      const commonPath = path.join(__dirname, "../../src/utils/common.ts");
      const commonContent = fs.readFileSync(commonPath, "utf-8");

      // Check for hardcoded error message
      const hasHardcodedError = commonContent.includes(
        '"Something went wrong."'
      );

      if (hasHardcodedError) {
        console.warn("Found hardcoded error message in common.ts");
        console.warn(
          'Consider moving "Something went wrong." to translation files'
        );
      }

      expect(hasHardcodedError).toBe(false);
    });

    test("should not have hardcoded country codes in components", () => {
      // Check StaffForm for hardcoded +45
      const staffFormPath = path.join(
        __dirname,
        "../../src/components/features/SignUp/StaffForm.tsx"
      );
      const staffFormContent = fs.readFileSync(staffFormPath, "utf-8");

      // Should use DENMARKCODE constant, not hardcoded +45
      const hasHardcodedCountryCode = staffFormContent.includes(
        "<CountryCode>+45</CountryCode>"
      );

      if (hasHardcodedCountryCode) {
        console.warn("Found hardcoded country code in StaffForm");
        console.warn(
          "Consider using DENMARKCODE constant from utils/common.ts"
        );
      }

      expect(hasHardcodedCountryCode).toBe(false);
    });

    test("should not have hardcoded validation field names", () => {
      // Check validation.ts for hardcoded field names
      const validationPath = path.join(
        __dirname,
        "../../src/components/features/SignUp/validation.ts"
      );
      const validationContent = fs.readFileSync(validationPath, "utf-8");

      // Should use translation keys, not hardcoded "Full name"
      const hasHardcodedFieldName = validationContent.includes('"Full name"');

      if (hasHardcodedFieldName) {
        console.warn("Found hardcoded field name in validation.ts");
        console.warn(
          'Consider using t("fields.fullName") instead of "Full name"'
        );
      }

      expect(hasHardcodedFieldName).toBe(false);
    });

    test("should not have hardcoded accessibility labels", () => {
      // Check Modal component for hardcoded aria-labels
      const modalPath = path.join(
        __dirname,
        "../../src/components/ui/Modals/index.tsx"
      );
      const modalContent = fs.readFileSync(modalPath, "utf-8");

      // Should use translation for aria-label="Close"
      const hasHardcodedAriaLabel = modalContent.includes('aria-label="Close"');

      if (hasHardcodedAriaLabel) {
        console.warn("Found hardcoded accessibility label in Modal");
        console.warn(
          'Consider using t("accessibility.closeModal") for better i18n support'
        );
      }

      expect(hasHardcodedAriaLabel).toBe(false);
    });
  });

  describe.skip("Translation Function Usage", () => {
    const mockT = jest.fn((key: string, options?: any) => {
      if (key.includes("validation.required") && options?.field) {
        return `${options.field} is required`;
      }
      return getNestedValue(enTranslations, key) || key;
    });

    beforeEach(() => {
      (useTranslation as jest.Mock).mockReturnValue({
        t: mockT,
        i18n: { changeLanguage: jest.fn() },
      });
      mockT.mockClear();
    });

    test("should call translation function for all UI text in HomeClient", () => {
      const HomeClient = require("../../src/components/HomeClient").default;
      render(React.createElement(HomeClient));

      // Verify that all expected translation keys are called
      const expectedCalls = [
        "Welcome",
        "Disable",
        "Manager",
        "fullName",
        "enterName",
        "forgetPasswordTitle",
        "forgetPasswordSubtitle",
        "forgetPasswordMessage",
        "requestPinReset",
        "resetPasswordTitle",
        "resetPasswordMessage",
        "resendPassword",
        "cancel",
        "viaEmail",
        "enterRegisteredEmail",
      ];

      expectedCalls.forEach(key => {
        expect(mockT).toHaveBeenCalledWith(key);
      });
    });

    test("should use interpolation for validation messages", () => {
      const {
        validateRequired,
      } = require("../../src/components/features/SignUp/validation");

      validateRequired("", "fields.fullName", mockT);

      expect(mockT).toHaveBeenCalledWith("validation.required", {
        field: expect.any(String),
      });
    });
  });

  describe.skip("Language Switching", () => {
    test("should support language switching", () => {
      expect(i18n.changeLanguage).toBeDefined();
      expect(typeof i18n.changeLanguage).toBe("function");
    });

    test("should have fallback language configured", () => {
      // i18next normalizes fallbackLng to an array internally
      const fallback = i18n.options.fallbackLng;
      if (Array.isArray(fallback)) {
        expect(fallback[0]).toBe("en");
      } else {
        expect(fallback).toBe("en");
      }
    });

    test("should have both supported languages", () => {
      const resources = i18n.options.resources;
      expect(resources).toHaveProperty("en");
      expect(resources).toHaveProperty("da");
    });
  });

  describe.skip("Translation Consistency", () => {
    test("should have consistent button labels across components", () => {
      const buttonLabels = ["signUp", "login", "cancel", "done", "submitting"];

      buttonLabels.forEach(label => {
        const enValue = enTranslations[label];
        const daValue = daTranslations[label];

        expect(enValue).toBeDefined();
        expect(daValue).toBeDefined();
        expect(typeof enValue).toBe("string");
        expect(typeof daValue).toBe("string");
        expect(enValue.trim()).not.toBe("");
        expect(daValue.trim()).not.toBe("");
      });
    });

    test("should have placeholder text for all input fields", () => {
      const placeholderKeys = [
        "enterName",
        "enterEmail",
        "enterPhoneNumber",
        "enterRestaurantName",
        "enterRestaurantAddress",
        "enterCvrNumber",
        "enterRegisteredEmail",
      ];

      placeholderKeys.forEach(key => {
        const enValue = enTranslations[key];
        const daValue = daTranslations[key];

        expect(enValue).toBeDefined();
        expect(daValue).toBeDefined();
        expect(enValue.toLowerCase()).toContain("enter");
      });
    });
  });
});

// Helper functions
function getAllKeys(obj: any, prefix = ""): string[] {
  let keys: string[] = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof obj[key] === "object" && obj[key] !== null) {
        keys = keys.concat(getAllKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
  }

  return keys;
}

function getAllValues(obj: any): string[] {
  let values: string[] = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        values = values.concat(getAllValues(obj[key]));
      } else {
        values.push(obj[key]);
      }
    }
  }

  return values;
}

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}
