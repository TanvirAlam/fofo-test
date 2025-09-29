// Note: extend-expect is built into React Native Testing Library v12.4+

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
}));

// Mock @react-navigation/native
jest.mock('@react-navigation/native', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  return {
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      dispatch: jest.fn(),
      setParams: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
      name: 'MockRoute',
      key: 'MockRouteKey',
    }),
    useFocusEffect: jest.fn(),
    NavigationContainer: ({ children }: { children: React.ReactNode }) => {
      return React.createElement('NavigationContainer', {}, children);
    },
    DefaultTheme: { colors: { background: '#ffffff' } },
    ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

// Mock @react-navigation/native-stack
jest.mock('@react-navigation/native-stack', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');
  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children, initialRouteName }: { children: React.ReactNode; initialRouteName?: string }) => {
        return React.createElement('Navigator', { initialRouteName }, children);
      },
      Screen: ({ component: Component, name }: { component: React.ComponentType<Record<string, unknown>>; name: string }) => {
        return React.createElement(Component, { key: name });
      },
    }),
  };
});

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: jest.fn(),
    },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

// Mock i18next-react-native-language-detector
jest.mock('i18next-react-native-language-detector', () => ({
  default: {
    type: 'languageDetector',
    init: jest.fn(),
    detect: jest.fn(() => 'en'),
    cacheUserLanguage: jest.fn(),
  },
}));

// Mock i18n setup
jest.mock('../utils/i18n', () => ({
  default: {
    language: 'en',
    use: jest.fn().mockReturnThis(),
    init: jest.fn().mockReturnThis(),
    t: (key: string) => key,
  },
}));

// Mock Expo modules
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

jest.mock('expo-constants', () => ({
  default: {
    statusBarHeight: 20,
    deviceName: 'iPhone',
    platform: { ios: { platform: 'ios' } },
  },
}));

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Note: NativeAnimatedHelper mock removed as it's not accessible in this version

// Global test timeout
jest.setTimeout(10000);

// Suppress deprecation warnings for tests
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('react-test-renderer is deprecated')
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};
