export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  audioUrl?: string;
}

export interface AIProvider {
  id: string;
  name: string;
  description: string;
  models: string[];
}

export interface SpeechConfig {
  provider: 'elevenlabs' | 'expo-speech' | 'web-speech';
  voice: string;
  speed: number;
  pitch: number;
}

export interface ChatConfig {
  aiProvider: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
}

export interface AppSettings {
  speechConfig: SpeechConfig;
  chatConfig: ChatConfig;
  autoSpeak: boolean;
  continuousListening: boolean;
}

export interface ServerConfig {
  port: number;
  nodeEnv: string;
}
