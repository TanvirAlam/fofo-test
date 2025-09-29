import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Message, ChatConfig, SpeechConfig } from '../types';
import { aiService } from '../services/aiService';
import { speechService } from '../services/speechService';

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Default configurations - these would come from settings in a real app
  const [chatConfig] = useState<ChatConfig>({
    aiProvider: 'openai',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: 'You are RFLCT AI, a helpful assistant that provides concise and helpful responses. Use 4-digit codes when referencing RFLCT features.',
  });

  const [speechConfig] = useState<SpeechConfig>({
    provider: Platform.OS === 'web' ? 'web-speech' : 'expo-speech',
    voice: 'default',
    speed: 1.0,
    pitch: 1.0,
  });

  const addMessage = useCallback((text: string, isUser: boolean): Message => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, message]);
    return message;
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    setIsProcessing(true);
    addMessage(text, true);

    try {
      const response = await aiService.sendMessage(text, chatConfig);
      addMessage(response, false);
      
      // Auto-speak AI response if enabled
      if (!isSpeaking) {
        setIsSpeaking(true);
        await speechService.speak(response, speechConfig);
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addMessage('Sorry, I encountered an error. Please try again.', false);
    } finally {
      setIsProcessing(false);
      setInputText('');
    }
  };

  const startListening = useCallback(async () => {
    if (isListening) return;

    try {
      setIsListening(true);
      await speechService.startListening(
        (transcript: string) => {
          // Handle interim results
          console.log('Transcript:', transcript);
        },
        () => {
          setIsListening(false);
        }
      );
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
      Alert.alert('Error', 'Could not start speech recognition');
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
    }
  }, [isListening]);

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage
      ]}
    >
      <Text style={[
        styles.messageText,
        message.isUser ? styles.userMessageText : styles.aiMessageText
      ]}>
        {message.text}
      </Text>
      <Text style={styles.timestamp}>
        {message.timestamp.toLocaleTimeString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Start a conversation with RFLCT AI
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Tap the microphone to speak or type your message
            </Text>
          </View>
        ) : (
          messages.map(renderMessage)
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          multiline
          returnKeyType="send"
          onSubmitEditing={() => handleSendMessage(inputText)}
        />
        
        <TouchableOpacity
          style={[
            styles.micButton,
            isListening && styles.micButtonActive
          ]}
          onPress={isListening ? stopListening : startListening}
          disabled={isProcessing}
        >
          <Text style={styles.micButtonText}>
            {isListening ? '⏹️' : '🎤'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.sendButton,
            (!inputText.trim() || isProcessing) && styles.sendButtonDisabled
          ]}
          onPress={() => handleSendMessage(inputText)}
          disabled={!inputText.trim() || isProcessing}
        >
          <Text style={styles.sendButtonText}>
            {isProcessing ? '⏳' : '➤'}
          </Text>
        </TouchableOpacity>
      </View>

      {isSpeaking && (
        <View style={styles.speakingIndicator}>
          <Text style={styles.speakingText}>🔊 Speaking...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3498db',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#ffffff',
  },
  aiMessageText: {
    color: '#2c3e50',
  },
  timestamp: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none',
    }),
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },
  micButtonActive: {
    backgroundColor: '#c0392b',
  },
  micButtonText: {
    fontSize: 20,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },
  sendButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  sendButtonText: {
    fontSize: 20,
    color: '#ffffff',
  },
  speakingIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#f39c12',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  speakingText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ChatScreen;
