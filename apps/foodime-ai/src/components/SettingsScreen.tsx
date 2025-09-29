import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { AI_PROVIDERS } from '../services/aiService';

const SettingsScreen = () => {
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [continuousListening, setContinuousListening] = useState(false);
  // Speech provider is auto-selected based on platform

  const renderProviderSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>AI Provider</Text>
      {AI_PROVIDERS.map((provider) => (
        <TouchableOpacity
          key={provider.id}
          style={[
            styles.optionButton,
            selectedProvider === provider.id && styles.optionButtonSelected
          ]}
          onPress={() => {
            setSelectedProvider(provider.id);
            setSelectedModel(provider.models[0]); // Set first model as default
          }}
        >
          <View>
            <Text style={[
              styles.optionText,
              selectedProvider === provider.id && styles.optionTextSelected
            ]}>
              {provider.name}
            </Text>
            <Text style={styles.optionDescription}>
              {provider.description}
            </Text>
          </View>
          {selectedProvider === provider.id && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderModelSelector = () => {
    const currentProvider = AI_PROVIDERS.find(p => p.id === selectedProvider);
    if (!currentProvider) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Model</Text>
        {currentProvider.models.map((model) => (
          <TouchableOpacity
            key={model}
            style={[
              styles.optionButton,
              selectedModel === model && styles.optionButtonSelected
            ]}
            onPress={() => setSelectedModel(model)}
          >
            <Text style={[
              styles.optionText,
              selectedModel === model && styles.optionTextSelected
            ]}>
              {model}
            </Text>
            {selectedModel === model && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSpeechSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Speech Settings</Text>
      
      <View style={styles.switchRow}>
        <View>
          <Text style={styles.switchLabel}>Auto-speak responses</Text>
          <Text style={styles.switchDescription}>
            Automatically read AI responses aloud
          </Text>
        </View>
        <Switch
          value={autoSpeak}
          onValueChange={setAutoSpeak}
          trackColor={{ false: '#767577', true: '#3498db' }}
          thumbColor={autoSpeak ? '#ffffff' : '#f4f3f4'}
        />
      </View>

      <View style={styles.switchRow}>
        <View>
          <Text style={styles.switchLabel}>Continuous listening</Text>
          <Text style={styles.switchDescription}>
            Keep listening after each response
          </Text>
        </View>
        <Switch
          value={continuousListening}
          onValueChange={setContinuousListening}
          trackColor={{ false: '#767577', true: '#3498db' }}
          thumbColor={continuousListening ? '#ffffff' : '#f4f3f4'}
        />
      </View>

      <Text style={styles.subsectionTitle}>Speech Provider</Text>
      {Platform.OS === 'web' ? (
        <TouchableOpacity
          style={[styles.optionButton, styles.optionButtonSelected]}
          disabled
        >
          <Text style={[styles.optionText, styles.optionTextSelected]}>
            Web Speech API
          </Text>
          <Text style={styles.checkmark}>✓</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.optionButton, styles.optionButtonSelected]}
          disabled
        >
          <Text style={[styles.optionText, styles.optionTextSelected]}>
            Expo Speech
          </Text>
          <Text style={styles.checkmark}>✓</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderRflctSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>RFLCT Settings</Text>
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>4-digit Code Format</Text>
        <Text style={styles.infoText}>
          This app uses 4-digit codes for RFLCT features, as preferred in your settings.
        </Text>
        <Text style={styles.infoExample}>
          Example: RFLCT-1234 instead of RFLCT-123456
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Configure your RFLCT AI experience</Text>
      </View>

      {renderProviderSelector()}
      {renderModelSelector()}
      {renderSpeechSettings()}
      {renderRflctSettings()}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          RFLCT AI v1.0.0
        </Text>
        <Text style={styles.footerSubtext}>
          Universal speech-to-speech AI assistant
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }),
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginTop: 20,
    marginBottom: 12,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },
  optionButtonSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#3498db',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  optionTextSelected: {
    color: '#3498db',
  },
  optionDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  checkmark: {
    fontSize: 18,
    color: '#3498db',
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 2,
  },
  switchDescription: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  infoCard: {
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
    marginBottom: 8,
  },
  infoExample: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  footer: {
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});

export default SettingsScreen;
