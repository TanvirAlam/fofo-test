import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, screen } from '../test/test-utils';
import { HomeScreen } from '../screens/HomeScreen';

// Mock Alert.alert
const mockAlert = Alert.alert as jest.Mock;

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all expected elements', () => {
    render(<HomeScreen />);

    // Check if main title is present
    expect(screen.getByText('Welcome to Foodime!')).toBeTruthy();
    
    // Check if subtitle is present
    expect(screen.getByText('Your mobile app is ready')).toBeTruthy();
    
    // Check if description is present
    expect(screen.getByText(/This is your React Native app with Expo/)).toBeTruthy();
    
    // Check if features section is present
    expect(screen.getByText('Features included:')).toBeTruthy();
    
    // Check if test button is present
    expect(screen.getByText('Test App 🚀')).toBeTruthy();
  });

  it('displays all feature items', () => {
    render(<HomeScreen />);

    const expectedFeatures = [
      '• React Navigation',
      '• Safe Area handling',
      '• TypeScript support',
      '• ESLint configuration',
      '• Shared UI components',
      '• Monorepo integration',
    ];

    expectedFeatures.forEach(feature => {
      expect(screen.getByText(feature)).toBeTruthy();
    });
  });

  it('shows success alert when test button is pressed', () => {
    render(<HomeScreen />);

    const testButton = screen.getByText('Test App 🚀');
    
    fireEvent.press(testButton);

    expect(mockAlert).toHaveBeenCalledWith(
      'Success!',
      'Your Foodime mobile app is working perfectly! 🎉'
    );
    expect(mockAlert).toHaveBeenCalledTimes(1);
  });

  it('has accessible button', () => {
    render(<HomeScreen />);

    const testButton = screen.getByText('Test App 🚀');
    expect(testButton).toBeTruthy();
    
    // Test that the button is touchable
    fireEvent.press(testButton);
    expect(mockAlert).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const { toJSON } = render(<HomeScreen />);
    expect(toJSON()).toMatchSnapshot();
  });
});
