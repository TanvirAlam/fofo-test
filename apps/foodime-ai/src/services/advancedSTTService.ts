import { Platform } from 'react-native';
import { HfInference } from '@huggingface/inference';

export interface STTProvider {
  id: string;
  name: string;
  description: string;
  type: 'cloud' | 'local' | 'hybrid';
  languages: string[];
  features: string[];
}

export interface STTConfig {
  provider: string;
  language: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  apiKey?: string;
}

export interface STTResult {
  text: string;
  confidence: number;
  alternatives?: { text: string; confidence: number }[];
  isFinal: boolean;
}

export const STT_PROVIDERS: STTProvider[] = [
  {
    id: 'web-speech',
    name: 'Web Speech API',
    description: 'Browser native speech recognition',
    type: 'local',
    languages: ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE'],
    features: ['real-time', 'interim-results', 'continuous']
  },
  {
    id: 'openai-whisper',
    name: 'OpenAI Whisper',
    description: 'OpenAI Whisper speech recognition',
    type: 'cloud',
    languages: ['auto', 'en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh'],
    features: ['high-accuracy', 'multilingual', 'transcription']
  },
  {
    id: 'huggingface-whisper',
    name: 'Hugging Face Whisper',
    description: 'Open-source Whisper models via Hugging Face',
    type: 'cloud',
    languages: ['auto', 'en', 'es', 'fr', 'de', 'it'],
    features: ['open-source', 'multiple-models', 'free-tier']
  },
  {
    id: 'google-speech',
    name: 'Google Speech-to-Text',
    description: 'Google Cloud Speech-to-Text',
    type: 'cloud',
    languages: ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'it-IT', 'pt-BR'],
    features: ['streaming', 'speaker-diarization', 'word-timestamps']
  },
  {
    id: 'azure-speech',
    name: 'Azure Speech Services',
    description: 'Microsoft Azure Speech Services',
    type: 'cloud',
    languages: ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'it-IT'],
    features: ['real-time', 'custom-models', 'pronunciation-assessment']
  },
  {
    id: 'deepgram',
    name: 'Deepgram',
    description: 'Deepgram speech recognition API',
    type: 'cloud',
    languages: ['en', 'es', 'fr', 'de', 'pt', 'ru', 'ja', 'ko'],
    features: ['real-time', 'batch', 'diarization', 'summarization']
  }
];

class AdvancedSTTService {
  private hfClient: HfInference | null = null;
  private recognition: SpeechRecognition | null = null;
  private isListening = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor() {
    this.initializeServices();
  }

  private async initializeServices() {
    // Initialize Hugging Face client
    if (process.env.HUGGINGFACE_API_KEY) {
      this.hfClient = new HfInference(process.env.HUGGINGFACE_API_KEY);
    }

    // Initialize Web Speech API
    if (Platform.OS === 'web') {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
      }
    }
  }

  async startListening(
    config: STTConfig,
    onResult: (result: STTResult) => void,
    onEnd?: () => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    if (this.isListening) {
      throw new Error('Already listening');
    }

    try {
      switch (config.provider) {
        case 'web-speech':
          await this.startWebSpeechListening(config, onResult, onEnd, onError);
          break;
        case 'openai-whisper':
        case 'huggingface-whisper':
        case 'google-speech':
        case 'azure-speech':
        case 'deepgram':
          await this.startCloudSTTListening(config, onResult, onEnd, onError);
          break;
        default:
          throw new Error(`Unsupported STT provider: ${config.provider}`);
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Unknown error'));
      throw error;
    }
  }

  private async startWebSpeechListening(
    config: STTConfig,
    onResult: (result: STTResult) => void,
    onEnd?: () => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    if (!this.recognition) {
      throw new Error('Web Speech API not supported');
    }

    this.recognition.continuous = config.continuous ?? true;
    this.recognition.interimResults = config.interimResults ?? true;
    this.recognition.lang = config.language || 'en-US';
    this.recognition.maxAlternatives = config.maxAlternatives || 1;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence || 0.9;
        
        const alternatives = [];
        for (let j = 0; j < Math.min(result.length, config.maxAlternatives || 1); j++) {
          alternatives.push({
            text: result[j].transcript,
            confidence: result[j].confidence || 0.9
          });
        }

        onResult({
          text: transcript,
          confidence,
          alternatives,
          isFinal: result.isFinal
        });
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd?.();
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      this.isListening = false;
      onError?.(new Error(`Speech recognition error: ${event.error}`));
    };

    this.recognition.start();
    this.isListening = true;
  }

  private async startCloudSTTListening(
    config: STTConfig,
    onResult: (result: STTResult) => void,
    onEnd?: () => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        try {
          const result = await this.transcribeAudio(audioBlob, config);
          onResult(result);
          onEnd?.();
        } catch (error) {
          onError?.(error instanceof Error ? error : new Error('Transcription failed'));
        }
        this.isListening = false;
      };

      this.mediaRecorder.onerror = (event) => {
        onError?.(new Error(`MediaRecorder error: ${event}`));
        this.isListening = false;
      };

      // Start recording
      this.mediaRecorder.start(1000); // Collect data every second
      this.isListening = true;

      // For continuous transcription, stop after a reasonable time
      if (config.continuous) {
        setTimeout(() => {
          if (this.isListening) {
            this.stopListening();
          }
        }, 30000); // Stop after 30 seconds
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error('Failed to start recording'));
      throw error;
    }
  }

  async stopListening(): Promise<void> {
    if (!this.isListening) return;

    if (this.recognition && Platform.OS === 'web') {
      this.recognition.stop();
    }

    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }

    this.isListening = false;
  }

  private async transcribeAudio(audioBlob: Blob, config: STTConfig): Promise<STTResult> {
    switch (config.provider) {
      case 'openai-whisper':
        return await this.transcribeWithOpenAI(audioBlob, config);
      case 'huggingface-whisper':
        return await this.transcribeWithHuggingFace(audioBlob, config);
      case 'google-speech':
        return await this.transcribeWithGoogle(audioBlob, config);
      case 'azure-speech':
        return await this.transcribeWithAzure(audioBlob, config);
      case 'deepgram':
        return await this.transcribeWithDeepgram(audioBlob, config);
      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
  }

  private async transcribeWithOpenAI(audioBlob: Blob, config: STTConfig): Promise<STTResult> {
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');
    formData.append('language', config.language || 'en');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey || process.env.OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`OpenAI Whisper API error: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      text: result.text,
      confidence: 0.95, // OpenAI doesn't provide confidence scores
      isFinal: true
    };
  }

  private async transcribeWithHuggingFace(audioBlob: Blob): Promise<STTResult> {
    if (!this.hfClient) {
      throw new Error('Hugging Face client not initialized');
    }

    try {
      const result = await this.hfClient.automaticSpeechRecognition({
        model: 'openai/whisper-large-v3',
        data: audioBlob,
      });

      return {
        text: result.text,
        confidence: 0.9,
        isFinal: true
      };
    } catch (error) {
      throw new Error(`Hugging Face STT error: ${error}`);
    }
  }

  private async transcribeWithGoogle(audioBlob: Blob, config: STTConfig): Promise<STTResult> {
    // Convert blob to base64
    const base64Audio = await this.blobToBase64(audioBlob);
    
    const requestBody = {
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: config.language || 'en-US',
        maxAlternatives: config.maxAlternatives || 1,
      },
      audio: {
        content: base64Audio.split(',')[1], // Remove data:audio/webm;base64, prefix
      },
    };

    const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${config.apiKey || process.env.GOOGLE_STT_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Google Speech API error: ${response.statusText}`);
    }

    const result = await response.json();
    const alternatives = result.results?.[0]?.alternatives || [];
    const bestMatch = alternatives[0];

    if (!bestMatch) {
      throw new Error('No transcription results');
    }

    return {
      text: bestMatch.transcript,
      confidence: bestMatch.confidence || 0.9,
      alternatives: alternatives.map((alt: { transcript: string; confidence?: number }) => ({
        text: alt.transcript,
        confidence: alt.confidence || 0.9
      })),
      isFinal: true
    };
  }

  private async transcribeWithAzure(audioBlob: Blob, config: STTConfig): Promise<STTResult> {
    // Get access token first
    const tokenResponse = await fetch(`https://${process.env.AZURE_REGION}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': config.apiKey || process.env.AZURE_SPEECH_KEY || '',
      },
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get Azure access token');
    }

    const accessToken = await tokenResponse.text();

    // Send audio for transcription
    const response = await fetch(`https://${process.env.AZURE_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${config.language || 'en-US'}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'audio/wav',
      },
      body: audioBlob,
    });

    if (!response.ok) {
      throw new Error(`Azure Speech API error: ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      text: result.DisplayText || result.RecognitionStatus || '',
      confidence: result.Confidence || 0.9,
      isFinal: true
    };
  }

  private async transcribeWithDeepgram(audioBlob: Blob, config: STTConfig): Promise<STTResult> {
    const response = await fetch('https://api.deepgram.com/v1/listen', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${config.apiKey || process.env.DEEPGRAM_API_KEY}`,
        'Content-Type': 'audio/wav',
      },
      body: audioBlob,
    });

    if (!response.ok) {
      throw new Error(`Deepgram API error: ${response.statusText}`);
    }

    const result = await response.json();
    const alternatives = result.results?.channels?.[0]?.alternatives || [];
    const bestMatch = alternatives[0];

    if (!bestMatch) {
      throw new Error('No transcription results');
    }

    return {
      text: bestMatch.transcript,
      confidence: bestMatch.confidence || 0.9,
      alternatives: alternatives.map((alt: { transcript: string; confidence?: number }) => ({
        text: alt.transcript,
        confidence: alt.confidence || 0.9
      })),
      isFinal: true
    };
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Test all providers with a sample audio
  async testAllProviders(audioBlob?: Blob): Promise<{ [key: string]: { success: boolean; error?: string; result?: STTResult } }> {
    const results: { [key: string]: { success: boolean; error?: string; result?: STTResult } } = {};

    // If no audio provided, try to create a simple test recording (web only)
    if (!audioBlob && Platform.OS === 'web') {
      try {
        audioBlob = await this.createTestAudio();
      } catch (error) {
        console.warn('Could not create test audio:', error);
      }
    }

    for (const provider of STT_PROVIDERS) {
      try {
        const config: STTConfig = {
          provider: provider.id,
          language: provider.languages[0] || 'en-US'
        };

        if (provider.type === 'local' && Platform.OS === 'web') {
          // Test web speech with a simple recognition
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error('Test timeout')), 5000);
            
            this.startListening(
              config,
              (result) => {
                clearTimeout(timeout);
                results[provider.id] = { success: true, result };
                resolve();
              },
              () => {
                clearTimeout(timeout);
                resolve();
              },
              (error) => {
                clearTimeout(timeout);
                reject(error);
              }
            );

            // Stop after 2 seconds
            setTimeout(() => this.stopListening(), 2000);
          });
        } else if (audioBlob) {
          const result = await this.transcribeAudio(audioBlob, config);
          results[provider.id] = { success: true, result };
        } else {
          results[provider.id] = { success: false, error: 'No test audio available' };
        }
      } catch (error) {
        results[provider.id] = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    return results;
  }

  private async createTestAudio(): Promise<Blob> {
    // This would create a simple audio blob for testing
    // For now, return empty blob - in real implementation, you'd generate or use a test file
    return new Blob([], { type: 'audio/wav' });
  }

  isListeningActive(): boolean {
    return this.isListening;
  }

  getSupportedProviders(): STTProvider[] {
    return STT_PROVIDERS.filter(provider => {
      if (Platform.OS === 'web') {
        return true; // All providers supported on web
      } else {
        return provider.type === 'cloud'; // Only cloud providers on mobile for now
      }
    });
  }
}

export const advancedSTTService = new AdvancedSTTService();
