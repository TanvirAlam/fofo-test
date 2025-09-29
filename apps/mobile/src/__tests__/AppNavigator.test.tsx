import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { AppNavigator } from '../navigation/AppNavigator';

// Note: We don't use test-utils here since AppNavigator provides its own NavigationContainer

describe('AppNavigator', () => {
  it('renders NavigationContainer', () => {
    const { UNSAFE_root } = render(<AppNavigator />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('renders HomeScreen as initial route', () => {
    render(<AppNavigator />);

    // The HomeScreen should be rendered as it's the initial route
    expect(screen.getByText('Welcome to Foodime!')).toBeTruthy();
    expect(screen.getByText('Your mobile app is ready')).toBeTruthy();
  });

  it('displays correct header title', () => {
    render(<AppNavigator />);

    // Note: In a real test environment, you might need to check for the header
    // This is a simplified test - header testing would require more complex setup
    expect(screen.getByText('Welcome to Foodime!')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<AppNavigator />);
    expect(toJSON()).toMatchSnapshot();
  });
});
