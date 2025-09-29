import React from 'react';

// Create a mock component factory
const createMockIconComponent = (name: string) => {
  const MockIcon = (props: React.ComponentPropsWithoutRef<typeof Text>) => {
    return React.createElement('Text', {
      ...props,
      testID: `mock-${name}-icon`,
    }, `MockIcon-${name}`);
  };
  MockIcon.displayName = `Mock${name}`;
  return MockIcon;
};

// Export all the icon components that might be used
export const AntDesign = createMockIconComponent('AntDesign');
export const Entypo = createMockIconComponent('Entypo');
export const EvilIcons = createMockIconComponent('EvilIcons');
export const Feather = createMockIconComponent('Feather');
export const FontAwesome = createMockIconComponent('FontAwesome');
export const FontAwesome5 = createMockIconComponent('FontAwesome5');
export const FontAwesome6 = createMockIconComponent('FontAwesome6');
export const Fontisto = createMockIconComponent('Fontisto');
export const Foundation = createMockIconComponent('Foundation');
export const Ionicons = createMockIconComponent('Ionicons');
export const MaterialCommunityIcons = createMockIconComponent('MaterialCommunityIcons');
export const MaterialIcons = createMockIconComponent('MaterialIcons');
export const Octicons = createMockIconComponent('Octicons');
export const SimpleLineIcons = createMockIconComponent('SimpleLineIcons');
export const Zocial = createMockIconComponent('Zocial');

// Default export
export default {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
};
