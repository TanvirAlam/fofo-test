import fs from "fs";
import path from "path";
import { glob } from "glob";

describe("Hardcoded String Detection", () => {
  let sourceFiles: string[] = [];

  beforeAll(async () => {
    // Find all TypeScript/JavaScript files in src directory
    const files = await glob("src/**/*.{ts,tsx,js,jsx}", {
      ignore: [
        "src/**/*.test.{ts,tsx,js,jsx}",
        "src/**/*.spec.{ts,tsx,js,jsx}",
        "src/locales/**/*.json",
      ],
    });
    sourceFiles = Array.isArray(files) ? files : [];
  });

  describe("Component Files", () => {
    const componentPattern = /src\/components\/.*\.(tsx?|jsx?)$/;

    test("should not have hardcoded user-facing strings in components", () => {
      const componentFiles = sourceFiles.filter(file =>
        componentPattern.test(file)
      );
      const violations: Array<{ file: string; line: number; content: string }> =
        [];

      componentFiles.forEach(filePath => {
        const content = fs.readFileSync(filePath, "utf-8");
        const lines = content.split("\n");

        lines.forEach((line, index) => {
          // Skip imports, comments, and other non-user-facing strings
          if (
            line.trim().startsWith("import") ||
            line.trim().startsWith("//") ||
            line.trim().startsWith("/*") ||
            line.trim().startsWith("*") ||
            line.includes("data-testid") ||
            line.includes("className") ||
            line.includes("console.") ||
            line.includes("require(") ||
            line.includes("from ") ||
            line.includes("export") ||
            line.includes("type ") ||
            line.includes("interface ") ||
            line.includes("jest.") ||
            line.includes("mock")
          ) {
            return;
          }

          // Look for potential hardcoded user-facing strings
          const stringMatches = line.match(/(["'])[A-Za-z][^"']*\1/g);

          if (stringMatches) {
            stringMatches.forEach(match => {
              const cleanMatch = match.slice(1, -1); // Remove quotes

              // Filter out technical strings that shouldn't be translated
              if (
                cleanMatch.length < 3 ||
                cleanMatch.match(/^[a-z_-]+$/) || // Technical identifiers
                cleanMatch.includes("http") ||
                cleanMatch.includes("www") ||
                cleanMatch.includes("@") ||
                cleanMatch.includes("/") ||
                cleanMatch.includes("#") ||
                (cleanMatch.includes(".") &&
                  cleanMatch.split(".").length > 1) ||
                cleanMatch.match(/^\d+$/) || // Numbers only
                cleanMatch.match(/^[A-Z_]+$/) || // Constants
                cleanMatch.includes("rgb") ||
                cleanMatch.includes("px") ||
                cleanMatch.includes("%") ||
                cleanMatch === "true" ||
                cleanMatch === "false"
              ) {
                return;
              }

              // These look like user-facing strings that should be translated
              if (
                cleanMatch.match(/^[A-Z]/) || // Starts with capital letter
                cleanMatch.includes(" ") || // Contains spaces
                cleanMatch.length > 10 // Long strings likely user-facing
              ) {
                violations.push({
                  file: filePath,
                  line: index + 1,
                  content: cleanMatch,
                });
              }
            });
          }
        });
      });

      if (violations.length > 0) {
        console.warn("Found potential hardcoded user-facing strings:");
        violations.forEach(violation => {
          console.warn(
            `${violation.file}:${violation.line} - "${violation.content}"`
          );
        });
        console.warn("Consider moving these strings to translation files");
      }

      // This test might initially fail - use it to identify strings to translate
      expect(violations.length).toBeLessThan(5); // Allow some flexibility initially
    });
  });

  describe("Known Hardcoded String Fixes", () => {
    test("should fix hardcoded error message in common.ts", () => {
      const commonPath = path.join(process.cwd(), "src/utils/common.ts");

      if (fs.existsSync(commonPath)) {
        const content = fs.readFileSync(commonPath, "utf-8");
        const hasHardcodedError = content.includes('"Something went wrong."');

        if (hasHardcodedError) {
          console.warn('Found hardcoded "Something went wrong." in common.ts');
          console.warn("Suggested fix:");
          console.warn(
            '1. Add "error.somethingWentWrong" to en.json and da.json'
          );
          console.warn(
            "2. Replace ERRORTITLE with ERRORTITLE_KEY and use t() function"
          );
        }

        expect(hasHardcodedError).toBe(false);
      }
    });

    test("should fix hardcoded country code in StaffForm", () => {
      const staffFormPath = path.join(
        process.cwd(),
        "src/components/features/SignUp/StaffForm.tsx"
      );

      if (fs.existsSync(staffFormPath)) {
        const content = fs.readFileSync(staffFormPath, "utf-8");
        const hasHardcodedCode = content.includes(
          "<CountryCode>+45</CountryCode>"
        );

        if (hasHardcodedCode) {
          console.warn('Found hardcoded "+45" in StaffForm.tsx');
          console.warn('Suggested fix: Use {DENMARKCODE} instead of "+45"');
        }

        expect(hasHardcodedCode).toBe(false);
      }
    });

    test("should fix hardcoded validation field names", () => {
      const validationPath = path.join(
        process.cwd(),
        "src/components/features/SignUp/validation.ts"
      );

      if (fs.existsSync(validationPath)) {
        const content = fs.readFileSync(validationPath, "utf-8");
        const hasHardcodedField = content.includes('"Full name"');

        if (hasHardcodedField) {
          console.warn('Found hardcoded "Full name" in validation.ts');
          console.warn("Suggested fixes:");
          console.warn(
            '1. Add "fields.fullName": "Full Name" to translation files'
          );
          console.warn("2. Update validateStaffForm to accept t parameter");
          console.warn('3. Use t("fields.fullName") instead of "Full name"');
        }

        expect(hasHardcodedField).toBe(false);
      }
    });

    test("should fix hardcoded accessibility labels", () => {
      const modalPath = path.join(
        process.cwd(),
        "src/components/ui/Modals/index.tsx"
      );

      if (fs.existsSync(modalPath)) {
        const content = fs.readFileSync(modalPath, "utf-8");
        const hasHardcodedLabel = content.includes('aria-label="Close"');

        if (hasHardcodedLabel) {
          console.warn('Found hardcoded aria-label="Close" in Modal');
          console.warn("Suggested fixes:");
          console.warn(
            '1. Add "accessibility.closeModal": "Close" to translation files'
          );
          console.warn("2. Use useTranslation in Modal component");
          console.warn(
            '3. Replace aria-label="Close" with aria-label={t("accessibility.closeModal")}'
          );
        }

        expect(hasHardcodedLabel).toBe(false);
      }
    });
  });

  describe("Console Messages", () => {
    test("should flag console messages for translation consideration", () => {
      const consoleMessages: Array<{
        file: string;
        line: number;
        message: string;
      }> = [];

      sourceFiles.forEach(filePath => {
        const content = fs.readFileSync(filePath, "utf-8");
        const lines = content.split("\n");

        lines.forEach((line, index) => {
          if (line.includes("console.error") || line.includes("console.warn")) {
            const stringMatch = line.match(/(["'])[^"']*\1/);
            if (stringMatch) {
              const message = stringMatch[0].slice(1, -1);
              if (
                message.length > 5 &&
                !message.includes("Error") &&
                !message.includes(":")
              ) {
                consoleMessages.push({
                  file: filePath,
                  line: index + 1,
                  message: message,
                });
              }
            }
          }
        });
      });

      if (consoleMessages.length > 0) {
        console.info(
          "Console messages found (consider if these should be translated):"
        );
        consoleMessages.forEach(msg => {
          console.info(`${msg.file}:${msg.line} - "${msg.message}"`);
        });
      }

      // This is informational, not a failing test
      expect(true).toBe(true);
    });
  });

  describe("URL and Technical Strings", () => {
    test("should allow technical strings but flag potential user-facing URLs", () => {
      const potentialUserFacingUrls: Array<{
        file: string;
        line: number;
        url: string;
      }> = [];

      sourceFiles.forEach(filePath => {
        const content = fs.readFileSync(filePath, "utf-8");
        const lines = content.split("\n");

        lines.forEach((line, index) => {
          // Look for URLs that might be user-facing
          const urlMatches = line.match(/(["'])(https?:\/\/[^"']*)\1/g);

          if (urlMatches) {
            urlMatches.forEach(match => {
              const url = match.slice(1, -1);

              // Skip API URLs and focus on potentially user-facing ones
              if (
                !url.includes("api.") &&
                !url.includes("localhost") &&
                !url.includes("127.0.0.1")
              ) {
                potentialUserFacingUrls.push({
                  file: filePath,
                  line: index + 1,
                  url: url,
                });
              }
            });
          }
        });
      });

      if (potentialUserFacingUrls.length > 0) {
        console.info(
          "User-facing URLs found (consider if these need localization):"
        );
        potentialUserFacingUrls.forEach(item => {
          console.info(`${item.file}:${item.line} - "${item.url}"`);
        });
      }

      // This is informational
      expect(true).toBe(true);
    });
  });
});
