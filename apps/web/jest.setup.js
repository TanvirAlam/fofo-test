import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

// Create a mock theme for styled components
const mockTheme = {
  colors: {
    primary: {
      WHITE: "#ffffff",
      BLACK: "#000000",
      100: "#f3f4f6",
    },
    neutral: {
      50: "#f9fafb",
      200: "#e5e7eb",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
      950: "#030712",
    },
  },
  media: {
    sm: "@media (min-width: 640px)",
    md: "@media (min-width: 768px)",
    lg: "@media (min-width: 1024px)",
  },
};

// Mock @packages/ui theme and COLORS
jest.mock("@packages/ui", () => ({
  ThemeProvider: ({ children }) => children,
  GlobalStyle: () => null,
  COLORS: {
    primary: {
      100: "#f3f4f6",
      WHITE: "#ffffff",
      BLACK: "#000000",
    },
  },
}));

// Mock react-i18next
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key, options) => {
      // Simple mock that returns the key or handles interpolation
      if (options && options.field) {
        return `${options.field} is required`;
      }
      return key;
    },
    i18n: {
      changeLanguage: jest.fn(),
      language: "en",
      options: {
        fallbackLng: "en", // Make sure this is a string in tests
        resources: {
          en: { translation: {} },
          da: { translation: {} },
        },
      },
    },
  }),
  I18nextProvider: ({ children }) => children,
}));

// Mock environment variables
process.env = {
  ...process.env,
  NODE_ENV: "test",
};

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
});

// Clean up after each test
afterEach(() => {
  // Clean up any side effects
  jest.restoreAllMocks();
});
