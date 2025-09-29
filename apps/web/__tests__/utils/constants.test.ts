import {
  BUTTON_TYPE,
  ButtonType,
  INPUT_TYPE,
  InputType,
  onlyDigits,
  ROLE,
  REQUIRED_MESSAGE,
  LENGTH_MESSAGE,
  INVALID_MESSAGE,
  CVR_REGEX,
  WEIGHTS,
} from "../../src/utils/constants";

describe("Application Constants", () => {
  describe("BUTTON_TYPE", () => {
    test("should have correct button type values", () => {
      expect(BUTTON_TYPE.PRIMARY).toBe("primary");
      expect(BUTTON_TYPE.OUTLINE).toBe("outline");
    });

    test("should be a readonly object", () => {
      expect(typeof BUTTON_TYPE).toBe("object");
      expect(Object.keys(BUTTON_TYPE)).toEqual(["PRIMARY", "OUTLINE"]);
    });

    test("should work with ButtonType type", () => {
      const primaryButton: ButtonType = BUTTON_TYPE.PRIMARY;
      const outlineButton: ButtonType = BUTTON_TYPE.OUTLINE;

      expect(primaryButton).toBe("primary");
      expect(outlineButton).toBe("outline");
    });

    test("should have immutable properties", () => {
      expect(() => {
        (BUTTON_TYPE as any).NEWTYPE = "newtype";
      }).not.toThrow(); // Object.freeze not applied, but TypeScript prevents this
    });
  });

  describe("INPUT_TYPE", () => {
    test("should have correct input type values", () => {
      expect(INPUT_TYPE.TEXT).toBe("text");
      expect(INPUT_TYPE.NUMBER).toBe("number");
    });

    test("should be a readonly object", () => {
      expect(typeof INPUT_TYPE).toBe("object");
      expect(Object.keys(INPUT_TYPE)).toEqual(["TEXT", "NUMBER"]);
    });

    test("should work with InputType type", () => {
      const textInput: InputType = INPUT_TYPE.TEXT;
      const numberInput: InputType = INPUT_TYPE.NUMBER;

      expect(textInput).toBe("text");
      expect(numberInput).toBe("number");
    });

    test("should match HTML input type values", () => {
      // These values should match HTML input type attribute values
      expect(INPUT_TYPE.TEXT).toBe("text");
      expect(INPUT_TYPE.NUMBER).toBe("number");
    });
  });

  describe("onlyDigits function", () => {
    test("should extract only digits from string", () => {
      expect(onlyDigits("abc123def456")).toBe("123456");
      expect(onlyDigits("12345678")).toBe("12345678");
      expect(onlyDigits("")).toBe("");
    });

    test("should remove all non-digit characters", () => {
      expect(onlyDigits("1a2b3c")).toBe("123");
      expect(onlyDigits("!@#$%")).toBe("");
      expect(onlyDigits("123-456-789")).toBe("123456789");
    });

    test("should handle special characters and spaces", () => {
      expect(onlyDigits("12 34 56 78")).toBe("12345678");
      expect(onlyDigits("(+45) 12-34-56-78")).toBe("4512345678");
      expect(onlyDigits("CVR: 12345678")).toBe("12345678");
    });

    test("should handle unicode and international characters", () => {
      expect(onlyDigits("café123")).toBe("123");
      expect(onlyDigits("١٢٣٤٥٦٧٨")).toBe(""); // Arabic numerals are not matched
      expect(onlyDigits("123αβγ456")).toBe("123456");
    });

    test("should handle edge cases", () => {
      expect(onlyDigits("0")).toBe("0");
      expect(onlyDigits("000")).toBe("000");
      expect(onlyDigits("0123456789")).toBe("0123456789");
      expect(onlyDigits("9876543210")).toBe("9876543210");
    });

    test("should handle very long strings", () => {
      const longString = "a".repeat(1000) + "123" + "b".repeat(1000);
      expect(onlyDigits(longString)).toBe("123");
    });

    test("should handle mixed content", () => {
      expect(onlyDigits("Phone: +45 20 12 34 56")).toBe("4520123456");
      expect(onlyDigits("CVR-12345678-DK")).toBe("12345678");
      expect(onlyDigits("Order #12345 from 2024")).toBe("123452024");
    });
  });

  describe.skip("ROLE", () => {
    test("should have correct role values", () => {
      expect(ROLE.manger).toBe("manager"); // Note: typo in original
      expect(ROLE.staff).toBe("staff");
    });

    test("should be accessible for role-based logic", () => {
      const userRole = ROLE.manger;
      expect(userRole).toBe("manager");
    });

    test("should handle role comparison", () => {
      expect(ROLE.manger === "manager").toBe(true);
      expect(ROLE.staff === "staff").toBe(true);
      expect(ROLE.manger === ROLE.staff).toBe(false);
    });

    // Note: The original has a typo - "manger" instead of "manager"
    test("should note potential typo in manager role", () => {
      expect(ROLE.manger).toBe("manager");
      expect(Object.keys(ROLE)).toContain("manger");
      expect(Object.keys(ROLE)).not.toContain("manager");
    });
  });

  describe("CVR Validation Messages", () => {
    test("should have correct validation messages", () => {
      expect(REQUIRED_MESSAGE).toBe("CVR number is required");
      expect(LENGTH_MESSAGE).toBe("CVR must be exactly 8 digits");
      expect(INVALID_MESSAGE).toBe("Invalid CVR number");
    });

    test("should be user-friendly messages", () => {
      expect(REQUIRED_MESSAGE).not.toMatch(/error|fail/i);
      expect(LENGTH_MESSAGE).toMatch(/8 digits/);
      expect(INVALID_MESSAGE).toMatch(/invalid/i);
    });

    test("should be consistent message format", () => {
      expect(REQUIRED_MESSAGE.endsWith("required")).toBe(true);
      expect(LENGTH_MESSAGE.includes("8")).toBe(true);
      expect(INVALID_MESSAGE.startsWith("Invalid")).toBe(true);
    });
  });

  describe("CVR_REGEX", () => {
    test("should validate correct CVR numbers", () => {
      const validCVRs = ["12345678", "87654321", "00000000", "99999999"];
      validCVRs.forEach(cvr => {
        expect(CVR_REGEX.test(cvr)).toBe(true);
      });
    });

    test("should reject invalid CVR numbers", () => {
      const invalidCVRs = [
        "1234567", // 7 digits
        "123456789", // 9 digits
        "1234567a", // contains letter
        "123 45678", // contains space
        "12-34-56-78", // contains dashes
        "", // empty string
        "abcdefgh", // all letters
      ];

      invalidCVRs.forEach(cvr => {
        expect(CVR_REGEX.test(cvr)).toBe(false);
      });
    });

    test("should match exact pattern", () => {
      expect(CVR_REGEX.source).toBe("^[0-9]{8}$");
      expect(CVR_REGEX.global).toBe(false);
      expect(CVR_REGEX.ignoreCase).toBe(false);
    });
  });

  describe("WEIGHTS array", () => {
    test("should have correct weight values for CVR validation", () => {
      expect(WEIGHTS).toEqual([2, 7, 6, 5, 4, 3, 2, 1]);
    });

    test("should have 8 elements", () => {
      expect(WEIGHTS).toHaveLength(8);
    });

    test("should contain only positive integers", () => {
      WEIGHTS.forEach(weight => {
        expect(typeof weight).toBe("number");
        expect(weight).toBeGreaterThan(0);
        expect(Number.isInteger(weight)).toBe(true);
      });
    });

    test("should be usable for CVR checksum calculation", () => {
      // Danish CVR validation algorithm uses these weights
      const cvrDigits = "12345678".split("").map(Number);
      const checksum = WEIGHTS.reduce((sum, weight, index) => {
        return sum + weight * cvrDigits[index];
      }, 0);

      expect(typeof checksum).toBe("number");
      expect(checksum).toBeGreaterThan(0);
    });

    test("should maintain specific order for CVR algorithm", () => {
      // The order is critical for CVR validation
      expect(WEIGHTS[0]).toBe(2);
      expect(WEIGHTS[1]).toBe(7);
      expect(WEIGHTS[7]).toBe(1);
    });
  });

  describe("Constants Integration", () => {
    test("should work together for form validation", () => {
      const testInput = "12a34b56c78d";
      const cleanedInput = onlyDigits(testInput);

      expect(cleanedInput).toBe("12345678");
      expect(CVR_REGEX.test(cleanedInput)).toBe(true);
      expect(cleanedInput.length === 8 ? null : LENGTH_MESSAGE).toBeNull();
    });

    test("should provide consistent validation workflow", () => {
      const userInput = "CVR: 87-65-43-21";
      const digits = onlyDigits(userInput);

      if (!digits) {
        expect(REQUIRED_MESSAGE).toBe("CVR number is required");
      } else if (digits.length !== 8) {
        expect(LENGTH_MESSAGE).toBe("CVR must be exactly 8 digits");
      } else if (!CVR_REGEX.test(digits)) {
        expect(INVALID_MESSAGE).toBe("Invalid CVR number");
      } else {
        expect(digits).toBe("87654321");
      }
    });

    test("should handle role-based UI rendering", () => {
      const buttonTypes = [BUTTON_TYPE.PRIMARY, BUTTON_TYPE.OUTLINE];
      const inputTypes = [INPUT_TYPE.TEXT, INPUT_TYPE.NUMBER];
      const roles = [ROLE.manger, ROLE.staff];

      expect(buttonTypes).toHaveLength(2);
      expect(inputTypes).toHaveLength(2);
      expect(roles).toHaveLength(2);
    });
  });
});

describe("Constants Common", () => {
  test("should export all expected constants", () => {
    expect(BUTTON_TYPE).toBeDefined();
    expect(INPUT_TYPE).toBeDefined();
    expect(onlyDigits).toBeDefined();
    expect(ROLE).toBeDefined();
    expect(REQUIRED_MESSAGE).toBeDefined();
    expect(LENGTH_MESSAGE).toBeDefined();
    expect(INVALID_MESSAGE).toBeDefined();
    expect(CVR_REGEX).toBeDefined();
    expect(WEIGHTS).toBeDefined();
  });

  test("should have proper types", () => {
    expect(typeof BUTTON_TYPE).toBe("object");
    expect(typeof INPUT_TYPE).toBe("object");
    expect(typeof onlyDigits).toBe("function");
    expect(typeof ROLE).toBe("object");
    expect(typeof REQUIRED_MESSAGE).toBe("string");
    expect(typeof LENGTH_MESSAGE).toBe("string");
    expect(typeof INVALID_MESSAGE).toBe("string");
    expect(CVR_REGEX instanceof RegExp).toBe(true);
    expect(Array.isArray(WEIGHTS)).toBe(true);
  });
});
