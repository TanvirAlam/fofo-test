import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Import our advanced services
import { advancedTTSService, TTS_PROVIDERS, TTSConfig } from '../services/advancedTTSService';
import { advancedSTTService, STT_PROVIDERS, STTConfig } from '../services/advancedSTTService';
import { orderProcessingService, OrderProcessingConfig } from '../services/orderProcessingService';

export function AITestingScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: { success: boolean; error?: string; duration?: number; voice?: string; timestamp?: string } }>({});
  const [selectedTTSProvider, setSelectedTTSProvider] = useState('web-speech');
  const [selectedSTTProvider, setSelectedSTTProvider] = useState('web-speech');
  const [testText, setTestText] = useState('Hello, welcome to Foodime! I\'d like to order a large pepperoni pizza with extra cheese.');
  const [orderProcessing, setOrderProcessing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<ProcessedOrder | null>(null);
  const [conversationLog, setConversationLog] = useState<ConversationEntry[]>([]);

  useEffect(() => {
    // Load any saved test results
    loadTestResults();
  }, []);

  const loadTestResults = () => {
    try {
      const saved = localStorage.getItem('ai_test_results');
      if (saved) {
        setTestResults(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading test results:', error);
    }
  };

  const saveTestResults = (results: typeof testResults) => {
    try {
      localStorage.setItem('ai_test_results', JSON.stringify(results));
      setTestResults(results);
    } catch (error) {
      console.error('Error saving test results:', error);
    }
  };

  const testSingleTTSProvider = async (providerId: string) => {
    setIsLoading(true);
    try {
      const provider = TTS_PROVIDERS.find(p => p.id === providerId);
      if (!provider) throw new Error('Provider not found');

      const voices = await advancedTTSService.getVoicesForProvider(providerId);
      const defaultVoice = voices[0]?.id || 'default';

      const config: TTSConfig = {
        provider: providerId,
        voice: defaultVoice,
        speed: 1.0,
        pitch: 1.0
      };

      const startTime = Date.now();
      await advancedTTSService.speak(testText, config);
      const duration = Date.now() - startTime;

      const result = {
        provider: providerId,
        success: true,
        duration,
        voice: defaultVoice,
        timestamp: new Date().toISOString()
      };

      Alert.alert('Success!', `${provider.name} TTS test completed in ${duration}ms`);
      
      const newResults = { ...testResults, [`tts_${providerId}`]: result };
      saveTestResults(newResults);
    } catch (error) {
      const errorResult = {
        provider: providerId,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      };
      
      Alert.alert('Error', `TTS test failed: ${errorResult.error}`);
      
      const newResults = { ...testResults, [`tts_${providerId}`]: errorResult };
      saveTestResults(newResults);
    } finally {
      setIsLoading(false);
    }
  };

  const testAllTTSProviders = async () => {
    setIsLoading(true);
    try {
      const results = await advancedTTSService.testAllProviders(testText);
      const newResults = { ...testResults, tts_batch: results };
      saveTestResults(newResults);
      
      const successCount = Object.values(results).filter(r => r.success).length;
      const totalCount = Object.keys(results).length;
      
      Alert.alert(
        'Batch Test Complete', 
        `${successCount}/${totalCount} providers succeeded`,
        [
          { text: 'View Results', onPress: () => console.log(results) },
          { text: 'OK' }
        ]
      );
    } catch (error) {
      Alert.alert('Error', `Batch test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testBatchTTSWithVoices = async () => {
    setIsLoading(true);
    try {
      const testTexts = [
        "Welcome to Foodime! How can I help you today?",
        "I'd like to order a large pepperoni pizza with extra cheese.",
        "Your total comes to $24.99. Will this be for pickup or delivery?",
        "Thank you for your order! Your food will be ready in 25-30 minutes."
      ];

      await advancedTTSService.batchTest(testTexts);
      Alert.alert('Success!', 'Batch voice test completed. Check console for details.');
    } catch (error) {
      Alert.alert('Error', `Batch voice test failed: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testSTTProvider = async (providerId: string) => {
    setIsLoading(true);
    try {
      const provider = STT_PROVIDERS.find(p => p.id === providerId);
      if (!provider) throw new Error('Provider not found');

      const config: STTConfig = {
        provider: providerId,
        language: provider.languages[0] || 'en-US',
        continuous: false,
        interimResults: true
      };

      Alert.alert(
        'Speech Test',
        `Starting ${provider.name} speech recognition. Speak now...`,
        [{ text: 'Cancel', onPress: () => advancedSTTService.stopListening() }]
      );

      await advancedSTTService.startListening(
        config,
        (result) => {
          if (result.isFinal) {
            const testResult = {
              provider: providerId,
              success: true,
              text: result.text,
              confidence: result.confidence,
              timestamp: new Date().toISOString()
            };
            
            const newResults = { ...testResults, [`stt_${providerId}`]: testResult };
            saveTestResults(newResults);
            
            Alert.alert(
              'Speech Recognition Result',
              `Text: "${result.text}"\nConfidence: ${(result.confidence * 100).toFixed(1)}%`
            );
          }
        },
        () => {
          console.log('Speech recognition ended');
          setIsLoading(false);
        },
        (error) => {
          const errorResult = {
            provider: providerId,
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
          };
          
          const newResults = { ...testResults, [`stt_${providerId}`]: errorResult };
          saveTestResults(newResults);
          
          Alert.alert('Speech Recognition Error', error.message);
          setIsLoading(false);
        }
      );

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (advancedSTTService.isListeningActive()) {
          advancedSTTService.stopListening();
        }
      }, 10000);

    } catch (error) {
      Alert.alert('Error', `STT test setup failed: ${error}`);
      setIsLoading(false);
    }
  };

  const startOrderProcessingTest = async () => {
    if (orderProcessing) {
      await orderProcessingService.stopOrderProcessing();
      setOrderProcessing(false);
      return;
    }

    setOrderProcessing(true);
    try {
      const config: OrderProcessingConfig = {
        sttProvider: selectedSTTProvider,
        ttsProvider: selectedTTSProvider,
        aiProvider: 'openai',
        restaurant: {
          id: 'test-restaurant',
          name: 'Foodime Test Pizzeria',
          phone: '555-0123',
          timezone: 'America/New_York'
        },
        language: 'en-US',
        maxConversationTime: 300,
        confirmationRequired: true
      };

      await orderProcessingService.startOrderProcessing(config);
      
      // Update UI with current order status
      const interval = setInterval(() => {
        const order = orderProcessingService.getCurrentOrder();
        const log = orderProcessingService.getConversationLog();
        setCurrentOrder(order);
        setConversationLog(log);
        
        if (!orderProcessingService.isProcessing()) {
          clearInterval(interval);
          setOrderProcessing(false);
        }
      }, 1000);

    } catch (error) {
      Alert.alert('Error', `Failed to start order processing: ${error}`);
      setOrderProcessing(false);
    }
  };

  const getProviderStatusColor = (providerId: string, type: 'tts' | 'stt') => {
    const result = testResults[`${type}_${providerId}`];
    if (!result) return '#666';
    return result.success ? '#4CAF50' : '#F44336';
  };

  const createEnvironmentFile = () => {
    const envContent = `# Foodime AI Environment Variables
# Add your API keys here

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Anthropic API Key  
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Google AI API Key
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# ElevenLabs API Key
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here

# Hugging Face API Key
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Google Cloud Speech-to-Text API Key
GOOGLE_STT_API_KEY=your_google_stt_api_key_here

# Azure Speech Services
AZURE_SPEECH_KEY=your_azure_speech_key_here
AZURE_REGION=your_azure_region_here

# Deepgram API Key
DEEPGRAM_API_KEY=your_deepgram_api_key_here

# Server URL
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
`;

    // Copy to clipboard if available
    if (navigator.clipboard) {
      navigator.clipboard.writeText(envContent).then(() => {
        Alert.alert('Environment File', 'Environment variables copied to clipboard! Create a .env.local file with these variables.');
      });
    } else {
      Alert.alert(
        'Environment Variables',
        'Create a .env.local file with these API keys:\n\n' + envContent.substring(0, 200) + '...'
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>🤖 Foodime AI Testing Suite</Text>
        <Text style={styles.subtitle}>Test TTS, STT, and Order Processing</Text>

        {/* Environment Setup */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Environment Setup</Text>
          <TouchableOpacity style={styles.button} onPress={createEnvironmentFile}>
            <Text style={styles.buttonText}>Generate .env.local Template</Text>
          </TouchableOpacity>
          <Text style={styles.note}>
            Set up your API keys in .env.local for full functionality
          </Text>
        </View>

        {/* Test Text Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Test Text</Text>
          <TextInput
            style={styles.textInput}
            value={testText}
            onChangeText={setTestText}
            multiline
            placeholder="Enter text to test with TTS..."
          />
        </View>

        {/* TTS Testing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔊 Text-to-Speech Testing</Text>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]} 
              onPress={testAllTTSProviders}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Test All TTS Providers</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]} 
              onPress={testBatchTTSWithVoices}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>Batch Voice Test</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.subSectionTitle}>Individual Providers:</Text>
          {TTS_PROVIDERS.map(provider => (
            <TouchableOpacity
              key={provider.id}
              style={[
                styles.providerButton,
                { borderLeftColor: getProviderStatusColor(provider.id, 'tts') }
              ]}
              onPress={() => testSingleTTSProvider(provider.id)}
              disabled={isLoading}
            >
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{provider.name}</Text>
                <Text style={styles.providerDescription}>{provider.description}</Text>
                <Text style={styles.providerType}>{provider.type} • {provider.voices.length} voices</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* STT Testing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎤 Speech-to-Text Testing</Text>
          {STT_PROVIDERS.map(provider => (
            <TouchableOpacity
              key={provider.id}
              style={[
                styles.providerButton,
                { borderLeftColor: getProviderStatusColor(provider.id, 'stt') }
              ]}
              onPress={() => testSTTProvider(provider.id)}
              disabled={isLoading}
            >
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{provider.name}</Text>
                <Text style={styles.providerDescription}>{provider.description}</Text>
                <Text style={styles.providerType}>
                  {provider.type} • {provider.languages.join(', ')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Processing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🍕 Order Processing Test</Text>
          
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>TTS Provider:</Text>
            <View style={styles.configOptions}>
              {TTS_PROVIDERS.slice(0, 3).map(provider => (
                <TouchableOpacity
                  key={provider.id}
                  style={[
                    styles.configOption,
                    selectedTTSProvider === provider.id && styles.configOptionSelected
                  ]}
                  onPress={() => setSelectedTTSProvider(provider.id)}
                >
                  <Text style={styles.configOptionText}>{provider.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.configRow}>
            <Text style={styles.configLabel}>STT Provider:</Text>
            <View style={styles.configOptions}>
              {STT_PROVIDERS.slice(0, 3).map(provider => (
                <TouchableOpacity
                  key={provider.id}
                  style={[
                    styles.configOption,
                    selectedSTTProvider === provider.id && styles.configOptionSelected
                  ]}
                  onPress={() => setSelectedSTTProvider(provider.id)}
                >
                  <Text style={styles.configOptionText}>{provider.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              orderProcessing && styles.stopButton
            ]}
            onPress={startOrderProcessingTest}
          >
            <Text style={styles.buttonText}>
              {orderProcessing ? '🛑 Stop Order Processing' : '🚀 Start Order Processing'}
            </Text>
          </TouchableOpacity>

          {orderProcessing && (
            <View style={styles.orderStatus}>
              <Text style={styles.orderStatusTitle}>Order Processing Active</Text>
              <Text style={styles.orderStatusText}>
                Speak to place an order. The AI will guide you through the process.
              </Text>
            </View>
          )}

          {currentOrder && (
            <View style={styles.orderInfo}>
              <Text style={styles.orderInfoTitle}>Current Order:</Text>
              <Text style={styles.orderInfoText}>
                Items: {currentOrder.items?.length || 0}
              </Text>
              <Text style={styles.orderInfoText}>
                Total: ${currentOrder.totalAmount?.toFixed(2) || '0.00'}
              </Text>
              <Text style={styles.orderInfoText}>
                Status: {currentOrder.status || 'pending'}
              </Text>
            </View>
          )}

          {conversationLog.length > 0 && (
            <View style={styles.conversationLog}>
              <Text style={styles.conversationLogTitle}>Conversation:</Text>
              <ScrollView style={styles.conversationScrollView}>
                {conversationLog.slice(-5).map((entry, index) => (
                  <View key={index} style={styles.conversationEntry}>
                    <Text style={[
                      styles.conversationSpeaker,
                      entry.type === 'customer' ? styles.customerSpeaker : styles.aiSpeaker
                    ]}>
                      {entry.type === 'customer' ? '👤 Customer' : '🤖 AI'}:
                    </Text>
                    <Text style={styles.conversationText}>{entry.content}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📊 Test Results</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setTestResults({});
                localStorage.removeItem('ai_test_results');
              }}
            >
              <Text style={styles.buttonText}>Clear Results</Text>
            </TouchableOpacity>
            <ScrollView style={styles.resultsContainer}>
              <Text style={styles.resultsText}>
                {JSON.stringify(testResults, null, 2)}
              </Text>
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#555',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#5856D6',
  },
  stopButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  providerButton: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#666',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  providerDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  providerType: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  configRow: {
    marginBottom: 12,
  },
  configLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  configOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  configOption: {
    flex: 1,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    alignItems: 'center',
  },
  configOptionSelected: {
    backgroundColor: '#007AFF',
  },
  configOptionText: {
    fontSize: 12,
    color: '#333',
  },
  orderStatus: {
    backgroundColor: '#e8f5e8',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  orderStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  orderStatusText: {
    fontSize: 14,
    color: '#2e7d32',
    marginTop: 4,
  },
  orderInfo: {
    backgroundColor: '#f0f8ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  orderInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 4,
  },
  orderInfoText: {
    fontSize: 14,
    color: '#1976d2',
  },
  conversationLog: {
    marginTop: 12,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    padding: 12,
  },
  conversationLogTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  conversationScrollView: {
    maxHeight: 200,
  },
  conversationEntry: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 6,
  },
  conversationSpeaker: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  customerSpeaker: {
    color: '#ff6b35',
  },
  aiSpeaker: {
    color: '#007AFF',
  },
  conversationText: {
    fontSize: 14,
    color: '#333',
  },
  resultsContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    maxHeight: 300,
    marginTop: 8,
  },
  resultsText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
  },
  note: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
});
