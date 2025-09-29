import crypto from "crypto";
export class SecurityUtils {
  static sanitizeInput(input: string): string {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  }

  static isValidRedirectUrl(url: string, allowedDomains: string[]): boolean {
    try {
      const urlObj = new URL(url);
      return allowedDomains.includes(urlObj.hostname);
    } catch {
      return false;
    }
  }

  static generateNonce(): string {
    return Buffer.from(crypto.randomUUID()).toString("base64");
  }

  static isAllowedFileType(filename: string, allowedTypes: string[]): boolean {
    const extension = filename.split(".").pop()?.toLowerCase();
    return extension ? allowedTypes.includes(extension) : false;
  }
}
