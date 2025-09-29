// Mock React Native components for testing
export const Alert = {
  alert: jest.fn(),
};

export const StyleSheet = {
  create: (styles: Record<string, unknown>) => styles,
  flatten: (styles: Record<string, unknown>) => styles,
  compose: (styles: Record<string, unknown>) => styles,
  hairlineWidth: 1,
  absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
};

export const Text = 'Text';
export const View = 'View';
export const ScrollView = 'ScrollView';
export const TouchableOpacity = 'TouchableOpacity';
export const TextInput = 'TextInput';
export const Image = 'Image';
export const FlatList = 'FlatList';
export const SectionList = 'SectionList';
export const ActivityIndicator = 'ActivityIndicator';
export const Switch = 'Switch';
export const Button = 'Button';
export const Dimensions = {
  get: jest.fn(() => ({ width: 375, height: 812 })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};
export const Platform = {
  OS: 'ios',
  select: jest.fn((obj) => obj.ios),
};

// Mock Animated
export const Animated = {
  View: 'Animated.View',
  Text: 'Animated.Text',
  Image: 'Animated.Image',
  ScrollView: 'Animated.ScrollView',
  Value: jest.fn(() => ({
    setValue: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    interpolate: jest.fn(() => ({
      setValue: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
  })),
  timing: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    reset: jest.fn(),
  })),
  spring: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    reset: jest.fn(),
  })),
  decay: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    reset: jest.fn(),
  })),
  loop: jest.fn(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    reset: jest.fn(),
  })),
  parallel: jest.fn(),
  sequence: jest.fn(),
  stagger: jest.fn(),
  delay: jest.fn(),
  createAnimatedComponent: jest.fn(() => 'AnimatedComponent'),
};

// Export everything that might be imported from react-native
export default {
  Alert,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  SectionList,
  ActivityIndicator,
  Switch,
  Button,
  Dimensions,
  Platform,
  Animated,
};
