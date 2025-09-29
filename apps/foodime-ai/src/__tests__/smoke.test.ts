/**
 * Smoke test for @rflct/ai package
 * This ensures the test suite runs and the basic setup is working
 */

describe('@rflct/ai smoke test', () => {
  it('should pass basic smoke test', () => {
    expect(true).toBe(true);
  });

  it('should be able to import basic Node.js modules', () => {
    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('path');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('fs');
    }).not.toThrow();
  });
});
