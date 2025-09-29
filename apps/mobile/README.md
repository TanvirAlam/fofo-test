# Foodime Mobile App

This is the React Native mobile application for Foodime, built with Expo and integrated into the monorepo.

## Features

- **React Native with Expo**: Latest Expo SDK ~53.0.20
- **TypeScript**: Full TypeScript support
- **Navigation**: React Navigation v7 with native stack
- **Monorepo Integration**: Shared packages and configurations
- **ESLint & Prettier**: Code quality and formatting
- **Safe Area Handling**: Proper screen layout on all devices

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm package manager
- Expo CLI (will be installed automatically)
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)
- Expo Go app on your physical device (for testing)

### Installation

The dependencies should already be installed when you ran `pnpm install` from the project root. If not, run:

```bash
# From the project root
pnpm install

# Or from the mobile app directory
cd apps/mobile
pnpm install
```

### Running the App

#### Option 1: From the root directory (recommended)
```bash
# Run the mobile app specifically
pnpm turbo dev --filter=@foodime/mobile

# Or run all development servers
pnpm dev
```

#### Option 2: From the mobile app directory
```bash
cd apps/mobile

# Start the Expo development server
pnpm start
# or
pnpm dev

# Start with specific platform
pnpm ios      # iOS simulator
pnpm android  # Android emulator
pnpm web      # Web browser
```

### Development Commands

```bash
# Type checking
pnpm check-types

# Linting
pnpm lint

# Start development server
pnpm start
```

### Project Structure

```
apps/mobile/
├── src/
│   ├── components/     # Reusable components
│   ├── screens/        # Screen components
│   ├── navigation/     # Navigation setup
│   ├── services/       # API and external services
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript type definitions
├── assets/             # Images, fonts, etc.
├── App.tsx            # Main app component
├── app.json           # Expo configuration
├── babel.config.js    # Babel configuration
├── tsconfig.json      # TypeScript configuration
└── package.json       # Dependencies and scripts
```

## Building for Production

### EAS Build (Recommended)

First, install EAS CLI and configure your project:

```bash
npm install -g @expo/eas-cli
eas login
eas build:configure
```

Then build for your target platform:

```bash
# Build for iOS
eas build --platform ios

# Build for Android  
eas build --platform android

# Build for both platforms
eas build --platform all
```

### Local Builds

For local development builds:

```bash
# iOS (requires macOS and Xcode)
pnpm ios --configuration Release

# Android
pnpm android --variant release
```

## Monorepo Integration

This mobile app is part of the Foodime monorepo and can use shared packages:

- `@packages/ui`: Shared UI components (Note: designed for web, needs React Native adaptation)
- `@repo/typescript-config`: Shared TypeScript configurations
- `@repo/eslint-config`: Shared ESLint rules
- `database`: Shared database utilities
- Other services and packages

## Testing

```bash
# Run type checking across the monorepo
pnpm turbo check-types

# Run linting
pnpm turbo lint

# Test specific to mobile app
cd apps/mobile
pnpm test  # (when tests are added)
```

## Troubleshooting

### Common Issues

1. **Metro bundler cache issues**: Clear the cache with `pnpm start --clear`
2. **Node modules issues**: Delete `node_modules` and run `pnpm install`
3. **iOS simulator issues**: Reset the iOS simulator
4. **Android emulator issues**: Wipe data and restart the emulator

### Expo Development Build

For more advanced native functionality, you may need to create a development build:

```bash
eas build --profile development --platform ios
eas build --profile development --platform android
```

## Contributing

1. Follow the existing code style and TypeScript patterns
2. Run `pnpm lint` and `pnpm check-types` before committing
3. Test on both iOS and Android when possible
4. Follow React Native and Expo best practices

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Turbo Documentation](https://turbo.build/)
