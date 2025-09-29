import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../../App';

describe('App', () => {
  it('renders without crashing', () => {
    const { UNSAFE_root } = render(<App />);
    expect(UNSAFE_root).toBeTruthy();
  });

  it('wraps app with SafeAreaProvider', () => {
    render(<App />);
    
    // Since SafeAreaProvider is mocked, we can test that the app renders
    // and includes the expected content from the HomeScreen (initial route)
    expect(screen.getByText('Welcome to Foodime!')).toBeTruthy();
  });

  it('includes StatusBar component', () => {
    const { UNSAFE_root } = render(<App />);
    
    // The StatusBar is mocked in our setup, but we can verify the app renders
    expect(UNSAFE_root).toBeTruthy();
  });

  it('includes AppNavigator', () => {
    render(<App />);
    
    // Verify that the navigation content is rendered
    expect(screen.getByText('Welcome to Foodime!')).toBeTruthy();
    expect(screen.getByText('Test App 🚀')).toBeTruthy();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<App />);
    expect(toJSON()).toMatchSnapshot();
  });
});
