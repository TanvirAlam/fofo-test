import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const navigateToChat = () => {
    // @ts-expect-error - Navigation types not properly configured
    navigation.navigate('Chat');
  };

  const navigateToSettings = () => {
    // @ts-expect-error - Navigation types not properly configured
    navigation.navigate('Settings');
  };

  const navigateToAITesting = () => {
    // @ts-expect-error - Navigation types not properly configured
    navigation.navigate('AITesting');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>RFLCT AI</Text>
        <Text style={styles.subtitle}>Speech-to-Speech AI Assistant</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={navigateToChat}
        >
          <Text style={styles.primaryButtonText}>Start AI Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={navigateToSettings}
        >
          <Text style={styles.secondaryButtonText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.testingButton]} 
          onPress={navigateToAITesting}
        >
          <Text style={styles.testingButtonText}>🧪 AI Testing Suite</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.features}>
        <Text style={styles.featuresTitle}>Features:</Text>
        <Text style={styles.featureItem}>• Multiple AI providers (OpenAI, Claude, Gemini)</Text>
        <Text style={styles.featureItem}>• Advanced TTS with 8 providers (ElevenLabs, Hugging Face, OpenAI, etc.)</Text>
        <Text style={styles.featureItem}>• Multi-provider STT (Whisper, Google, Azure, Deepgram)</Text>
        <Text style={styles.featureItem}>• Complete order processing system</Text>
        <Text style={styles.featureItem}>• Cross-platform support (Web & Mobile)</Text>
        <Text style={styles.featureItem}>• 4-digit RFLCT code support</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 40,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#3498db',
  },
  testingButton: {
    backgroundColor: '#e74c3c',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#3498db',
    fontSize: 18,
    fontWeight: 'bold',
  },
  testingButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  features: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }),
    elevation: 2,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  featureItem: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 8,
    lineHeight: 24,
  },
});

export default HomeScreen;
