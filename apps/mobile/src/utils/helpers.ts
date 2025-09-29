/**
 * Utility functions for the Foodime mobile app
 */

export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, "");

  // Format as (XXX) XXX-XXXX for US phone numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return phone; // Return original if not 10 digits
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Phone validation & auto-format
export const validatePhone = (value: string) => {
  const phoneRegex = /^\d{4}-\d{4}$/;
  if (!phoneRegex.test(value)) {
    return "Phone format must be 4 digits - 4 digits";
  }
  return true;
};

export const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length <= 4) return digits;
  if (digits.length <= 8) return digits.slice(0, 4) + "-" + digits.slice(4, 8);
  return digits.slice(0, 4) + "-" + digits.slice(4, 8); // Limit to 8 digits
};

// Display placeholder
export const getPhonePlaceholder = (): string => {
  return "+45 XX XX XX XX";
};

// Password strength
export const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return "Very Weak";
  if (score === 2) return "Weak";
  if (score === 3) return "Fair";
  if (score === 4) return "Strong";
  return "Strong";
};
export const timeOutDelay = 1200;
