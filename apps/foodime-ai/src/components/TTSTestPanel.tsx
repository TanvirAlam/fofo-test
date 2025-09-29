import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { localTTSAdapter } from '../services/localTTSAdapter';

interface Voice {
  id: string;
  name: string;
  language: string;
}

interface TTSTestResult {
  success: boolean;
  error?: string;
  duration?: number;
}

export function TTSTestPanel() {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testText, setTestText] = useState(
    'Hello! Welcome to Foodime. I\'d be happy to take your order.'
  );
  const [activeProvider, setActiveProvider] = useState('bark');
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [testResults, setTestResults] = useState<{ [key: string]: TTSTestResult }>({});
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Sample phrases for restaurant use cases
  const samplePhrases = [
    'Welcome to Foodime! How may I help you today?',
    'Would you like to try our special pepperoni pizza?',
    'Your total comes to twenty-four dollars and ninety-nine cents.',
    'Your order will be ready in about 30 minutes.',
    'Thank you for choosing Foodime! Have a great day!'
  ];

  useEffect(() => {
    initializeTTS();
  }, []);

  useEffect(() => {
    loadVoices();
  }, [activeProvider, initialized, loadVoices]);

  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.remove();
      }
    };
  }, [currentAudio]);

  const initializeTTS = async () => {
    try {
      setLoading(true);
      await localTTSAdapter.initialize();
      setInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize TTS');
    } finally {
      setLoading(false);
    }
  };

  const loadVoices = useCallback(() => {
    if (!initialized) return;
    const availableVoices = localTTSAdapter.getAvailableVoices(activeProvider);
    setVoices(availableVoices);
    setSelectedVoice(availableVoices[0]?.id || null);
  }, [initialized, activeProvider]);

  const playAudio = async (audioData: ArrayBuffer) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.remove();
    }

    const blob = new Blob([audioData], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

    audio.onplay = () => setAudioPlaying(true);
    audio.onended = () => {
      setAudioPlaying(false);
      URL.revokeObjectURL(url);
    };
    audio.onerror = () => {
      setAudioPlaying(false);
      URL.revokeObjectURL(url);
      setError('Failed to play audio');
    };

    setCurrentAudio(audio);
    await audio.play();
  };

  const testVoice = async (text: string, voiceId: string) => {
    if (!initialized || !voiceId) return;

    try {
      setLoading(true);
      const startTime = Date.now();
      
      const result = await localTTSAdapter.testVoice(activeProvider, voiceId, text);
      
      const duration = Date.now() - startTime;
      
      if (result.success) {
        await playAudio(result.audioData);
        setTestResults(prev => ({
          ...prev,
          [voiceId]: { success: true, duration }
        }));
      } else {
        setTestResults(prev => ({
          ...prev,
          [voiceId]: { success: false, error: result.error }
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test voice');
    } finally {
      setLoading(false);
    }
  };

  const testAllVoices = async () => {
    if (!initialized) return;

    try {
      setLoading(true);
      for (const voice of voices) {
        await testVoice(testText, voice.id);
        // Add delay between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test all voices');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🎤 TTS Voice Testing</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
        </View>
      )}

      {/* Provider Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Provider:</Text>
        <View style={styles.providerButtons}>
          <TouchableOpacity
            style={[
              styles.providerButton,
              activeProvider === 'bark' && styles.activeProvider
            ]}
            onPress={() => setActiveProvider('bark')}
          >
            <Text style={styles.providerButtonText}>Bark</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.providerButton,
              activeProvider === 'fastspeech2' && styles.activeProvider
            ]}
            onPress={() => setActiveProvider('fastspeech2')}
          >
            <Text style={styles.providerButtonText}>FastSpeech2</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Voice Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Voice:</Text>
        <ScrollView horizontal style={styles.voiceButtons}>
          {voices.map(voice => (
            <TouchableOpacity
              key={voice.id}
              style={[
                styles.voiceButton,
                selectedVoice === voice.id && styles.activeVoice
              ]}
              onPress={() => setSelectedVoice(voice.id)}
            >
              <Text style={styles.voiceButtonText}>{voice.name}</Text>
              <Text style={styles.voiceLanguage}>{voice.language}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Test Text Input */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Text:</Text>
        <TextInput
          style={styles.textInput}
          value={testText}
          onChangeText={setTestText}
          multiline
          numberOfLines={3}
          placeholder="Enter text to test..."
        />
      </View>

      {/* Sample Phrases */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sample Phrases:</Text>
        <ScrollView style={styles.phrasesContainer}>
          {samplePhrases.map((phrase, index) => (
            <TouchableOpacity
              key={index}
              style={styles.phraseButton}
              onPress={() => {
                setTestText(phrase);
                if (selectedVoice) {
                  testVoice(phrase, selectedVoice);
                }
              }}
            >
              <Text style={styles.phraseText}>{phrase}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Test Controls */}
      <View style={styles.section}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => selectedVoice && testVoice(testText, selectedVoice)}
            disabled={loading || !selectedVoice || audioPlaying}
          >
            <Text style={styles.buttonText}>
              {loading ? '🔄 Processing...' : '▶️ Test Voice'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={testAllVoices}
            disabled={loading || audioPlaying}
          >
            <Text style={styles.buttonText}>
              {loading ? '🔄 Testing...' : '🔄 Test All'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Test Results */}
      {Object.keys(testResults).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Results:</Text>
          {Object.entries(testResults).map(([voiceId, result]) => {
            const voice = voices.find(v => v.id === voiceId);
            return (
              <View key={voiceId} style={styles.resultItem}>
                <Text style={styles.resultTitle}>
                  {voice?.name || voiceId}
                </Text>
                <Text style={styles.resultStatus}>
                  {result.success ? '✅ Success' : '❌ Failed'}
                  {result.duration && ` (${result.duration}ms)`}
                </Text>
                {result.error && (
                  <Text style={styles.resultError}>{result.error}</Text>
                )}
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#34495e',
  },
  providerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  providerButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  activeProvider: {
    backgroundColor: '#3498db',
  },
  providerButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  voiceButtons: {
    flexDirection: 'row',
  },
  voiceButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    minWidth: 100,
  },
  activeVoice: {
    backgroundColor: '#3498db',
  },
  voiceButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    textAlign: 'center',
  },
  voiceLanguage: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 4,
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
  phrasesContainer: {
    maxHeight: 200,
  },
  phraseButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
  },
  phraseText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondaryButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    padding: 15,
    backgroundColor: '#fee',
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
  },
  resultItem: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  resultStatus: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  resultError: {
    fontSize: 14,
    color: '#e74c3c',
    marginTop: 4,
  },
});
