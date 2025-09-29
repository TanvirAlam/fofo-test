module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.expo/',
    '<rootDir>/dist/',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@testing-library/react-native|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|@expo/vector-icons|react-navigation|@react-native-community|@react-native-async-storage/async-storage|react-native-safe-area-context|react-native-screens)',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: [
    '<rootDir>/src/__tests__/**/*.(ts|tsx|js)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx|js)',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/test/**/*',
    '!src/**/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Mock react-native components
    '^react-native$': '<rootDir>/src/test/react-native-mock.ts',
    // Mock @expo/vector-icons
    '^@expo/vector-icons$': '<rootDir>/src/test/expo-vector-icons-mock.ts',
    // Mock i18next-react-native-language-detector
    '^i18next-react-native-language-detector$': '<rootDir>/src/test/i18next-language-detector-mock.ts',
    // Mock react-native-locale-detector
    '^react-native-locale-detector$': '<rootDir>/src/test/react-native-locale-detector-mock.ts',
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};
