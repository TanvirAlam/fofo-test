import {
  formatPrice,
  capitalizeFirstLetter,
  validateEmail,
  truncateText,
  formatPhoneNumber,
  debounce,
  generateId,
} from '../utils/helpers';

describe('Helper Functions', () => {
  describe('formatPrice', () => {
    it('formats price with two decimal places', () => {
      expect(formatPrice(10)).toBe('$10.00');
      expect(formatPrice(10.5)).toBe('$10.50');
      expect(formatPrice(10.99)).toBe('$10.99');
    });

    it('handles zero and negative values', () => {
      expect(formatPrice(0)).toBe('$0.00');
      expect(formatPrice(-5.50)).toBe('$-5.50');
    });

    it('rounds to two decimal places', () => {
      expect(formatPrice(10.999)).toBe('$11.00');
      expect(formatPrice(10.001)).toBe('$10.00');
    });
  });

  describe('capitalizeFirstLetter', () => {
    it('capitalizes first letter and lowercases rest', () => {
      expect(capitalizeFirstLetter('hello')).toBe('Hello');
      expect(capitalizeFirstLetter('HELLO')).toBe('Hello');
      expect(capitalizeFirstLetter('hELLO')).toBe('Hello');
    });

    it('handles empty or short strings', () => {
      expect(capitalizeFirstLetter('')).toBe('');
      expect(capitalizeFirstLetter('a')).toBe('A');
    });

    it('handles special characters', () => {
      expect(capitalizeFirstLetter('hello world')).toBe('Hello world');
      expect(capitalizeFirstLetter('123abc')).toBe('123abc');
    });
  });

  describe('validateEmail', () => {
    it('validates correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user+tag@example.co.uk')).toBe(true);
      expect(validateEmail('firstname.lastname@company.com')).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('test@.com')).toBe(false);
    });
  });

  describe('truncateText', () => {
    it('truncates text longer than max length', () => {
      expect(truncateText('Hello World', 8)).toBe('Hello...');
      expect(truncateText('This is a very long text', 10)).toBe('This is...');
    });

    it('returns original text if shorter than max length', () => {
      expect(truncateText('Short', 10)).toBe('Short');
      expect(truncateText('Hello World', 20)).toBe('Hello World');
    });

    it('handles edge cases', () => {
      expect(truncateText('Hello World', 11)).toBe('Hello World');
      expect(truncateText('', 5)).toBe('');
      expect(truncateText('Hi', 3)).toBe('Hi');
    });
  });

  describe('formatPhoneNumber', () => {
    it('formats 10-digit US phone numbers', () => {
      expect(formatPhoneNumber('1234567890')).toBe('(123) 456-7890');
      expect(formatPhoneNumber('555-123-4567')).toBe('(555) 123-4567');
      expect(formatPhoneNumber('(555) 123-4567')).toBe('(555) 123-4567');
    });

    it('returns original for non-10-digit numbers', () => {
      expect(formatPhoneNumber('123')).toBe('123');
      expect(formatPhoneNumber('12345678901')).toBe('12345678901');
      expect(formatPhoneNumber('')).toBe('');
    });

    it('handles various input formats', () => {
      expect(formatPhoneNumber('555.123.4567')).toBe('(555) 123-4567');
      expect(formatPhoneNumber('555 123 4567')).toBe('(555) 123-4567');
      expect(formatPhoneNumber('(555)123-4567')).toBe('(555) 123-4567');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('delays function execution', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn('test');
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(300);
      expect(mockFn).toHaveBeenCalledWith('test');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('cancels previous calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 300);

      debouncedFn('first');
      debouncedFn('second');
      debouncedFn('third');

      jest.advanceTimersByTime(300);
      
      expect(mockFn).toHaveBeenCalledWith('third');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      const id3 = generateId();

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    it('generates IDs of expected format', () => {
      const id = generateId();
      
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
      expect(id.length).toBeLessThanOrEqual(9);
      // Should only contain alphanumeric characters
      expect(/^[a-z0-9]+$/i.test(id)).toBe(true);
    });
  });
});
