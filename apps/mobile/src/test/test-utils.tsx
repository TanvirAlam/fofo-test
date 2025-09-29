import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {children}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react-native';

// override render method
export { customRender as render };

// Additional test utilities
export const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  setParams: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  canGoBack: jest.fn(() => true),
  getId: jest.fn(() => 'test-id'),
  getParent: jest.fn(),
  getState: jest.fn(() => ({
    key: 'test-key',
    index: 0,
    routeNames: ['Home'],
    routes: [{ key: 'Home', name: 'Home' }],
  })),
  isFocused: jest.fn(() => true),
  reset: jest.fn(),
  setOptions: jest.fn(),
});

export const createMockRoute = (params = {}) => ({
  key: 'test-route-key',
  name: 'TestRoute',
  params,
});

// Mock data generators
export const mockScreenProps = (overrides = {}) => ({
  navigation: createMockNavigation(),
  route: createMockRoute(),
  ...overrides,
});
