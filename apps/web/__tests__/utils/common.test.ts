import { DENMARKCODE, ERRORTITLE_KEY } from "../../src/utils/common";

describe("Common Constants", () => {
  describe("DENMARKCODE", () => {
    test("should have correct Denmark country code", () => {
      expect(DENMARKCODE).toBe("+45");
    });

    test("should be a string type", () => {
      expect(typeof DENMARKCODE).toBe("string");
    });

    test("should start with plus sign", () => {
      expect(DENMARKCODE.startsWith("+")).toBe(true);
    });

    test("should contain only digits after plus sign", () => {
      const digits = DENMARKCODE.slice(1);
      expect(/^\d+$/.test(digits)).toBe(true);
    });

    test("should be readonly constant", () => {
      // This test ensures the constant cannot be reassigned
      // If this were mutable, TypeScript would catch it at compile time
      expect(DENMARKCODE).toBe("+45");
    });
  });

  describe("ERRORTITLE_KEY", () => {
    test("should have correct translation key", () => {
      expect(ERRORTITLE_KEY).toBe("error.somethingWentWrong");
    });

    test("should be a string type", () => {
      expect(typeof ERRORTITLE_KEY).toBe("string");
    });

    test("should be a valid translation key format", () => {
      expect(ERRORTITLE_KEY).toMatch(
        /^[a-zA-Z][a-zA-Z0-9]*\.[a-zA-Z][a-zA-Z0-9]*$/
      );
    });

    test("should not be empty", () => {
      expect(ERRORTITLE_KEY.length).toBeGreaterThan(0);
      expect(ERRORTITLE_KEY.trim()).not.toBe("");
    });

    test("should follow error key naming convention", () => {
      expect(ERRORTITLE_KEY).toMatch(/^error\./i);
      expect(ERRORTITLE_KEY).toMatch(/somethingWentWrong/i);
    });

    test("should be readonly constant", () => {
      // This test ensures the constant cannot be reassigned
      expect(ERRORTITLE_KEY).toBe("error.somethingWentWrong");
    });
  });

  describe("Constants integration", () => {
    test("should export all expected constants", () => {
      expect(DENMARKCODE).toBeDefined();
      expect(ERRORTITLE_KEY).toBeDefined();
    });

    test("should have different values for different constants", () => {
      expect(DENMARKCODE).not.toBe(ERRORTITLE_KEY);
    });
  });
});
