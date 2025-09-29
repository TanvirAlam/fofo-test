import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

// Import screens
import HomeScreen from './src/components/HomeScreen';
import ChatScreen from './src/components/ChatScreen';
import SettingsScreen from './src/components/SettingsScreen';
import { AITestingScreen } from './src/components/AITestingScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: Platform.OS === 'web' ? '#f8f9fa' : '#000',
          },
          headerTintColor: Platform.OS === 'web' ? '#000' : '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'RFLCT AI' }}
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen} 
          options={{ title: 'AI Chat' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen} 
          options={{ title: 'Settings' }}
        />
        <Stack.Screen 
          name="AITesting" 
          component={AITestingScreen} 
          options={{ title: 'AI Testing Suite' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
