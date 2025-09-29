import { Platform } from 'react-native';
import { HfInference } from '@huggingface/inference';

export interface TTSProvider {
  id: string;
  name: string;
  description: string;
  type: 'cloud' | 'local' | 'hybrid';
  voices: TTSVoice[];
}

export interface TTSVoice {
  id: string;
  name: string;
  language: string;
  gender: 'male' | 'female' | 'neutral';
  description: string;
}

export interface TTSConfig {
  provider: string;
  voice: string;
  speed: number;
  pitch: number;
  stability?: number;
  similarityBoost?: number;
  apiKey?: string;
}

export const TTS_PROVIDERS: TTSProvider[] = [
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'Premium AI voice synthesis',
    type: 'cloud',
    voices: [
      { id: 'Rachel', name: 'Rachel', language: 'en-US', gender: 'female', description: 'American English, calm and professional' },
      { id: 'Drew', name: 'Drew', language: 'en-US', gender: 'male', description: 'American English, confident and clear' },
      { id: 'Bella', name: 'Bella', language: 'en-US', gender: 'female', description: 'American English, friendly and warm' },
      { id: 'Antoni', name: 'Antoni', language: 'en-US', gender: 'male', description: 'American English, mature and trustworthy' },
      { id: 'Elli', name: 'Elli', language: 'en-US', gender: 'female', description: 'American English, energetic and expressive' }
    ]
  },
  {
    id: 'huggingface',
    name: 'Hugging Face TTS',
    description: 'Open-source models via Hugging Face',
    type: 'cloud',
    voices: [
      { id: 'microsoft/speecht5_tts', name: 'SpeechT5', language: 'en-US', gender: 'neutral', description: 'Microsoft SpeechT5 model' },
      { id: 'espnet/espnet2_english_male_ryanspeech', name: 'Ryan Speech', language: 'en-US', gender: 'male', description: 'ESPnet English male voice' },
      { id: 'facebook/mms-tts-eng', name: 'MMS English', language: 'en-US', gender: 'neutral', description: 'Meta MMS multilingual TTS' }
    ]
  },
  {
    id: 'coqui',
    name: 'Coqui TTS',
    description: 'Open-source neural TTS',
    type: 'hybrid',
    voices: [
      { id: 'tts_models/en/ljspeech/tacotron2-DDC', name: 'LJ Speech Tacotron2', language: 'en-US', gender: 'female', description: 'High quality female voice' },
      { id: 'tts_models/en/vctk/vits', name: 'VCTK VITS', language: 'en-US', gender: 'neutral', description: 'Multi-speaker VITS model' },
      { id: 'tts_models/en/ljspeech/glow-tts', name: 'LJ Speech Glow-TTS', language: 'en-US', gender: 'female', description: 'Fast parallel TTS' }
    ]
  },
  {
    id: 'openai',
    name: 'OpenAI TTS',
    description: 'OpenAI Text-to-Speech API',
    type: 'cloud',
    voices: [
      { id: 'alloy', name: 'Alloy', language: 'en-US', gender: 'neutral', description: 'Balanced and versatile' },
      { id: 'echo', name: 'Echo', language: 'en-US', gender: 'male', description: 'Deep and resonant' },
      { id: 'fable', name: 'Fable', language: 'en-US', gender: 'male', description: 'Warm and engaging' },
      { id: 'onyx', name: 'Onyx', language: 'en-US', gender: 'male', description: 'Strong and confident' },
      { id: 'nova', name: 'Nova', language: 'en-US', gender: 'female', description: 'Clear and professional' },
      { id: 'shimmer', name: 'Shimmer', language: 'en-US', gender: 'female', description: 'Bright and energetic' }
    ]
  },
  {
    id: 'azure',
    name: 'Azure Cognitive Services',
    description: 'Microsoft Azure Speech Services',
    type: 'cloud',
    voices: [
      { id: 'en-US-JennyNeural', name: 'Jenny Neural', language: 'en-US', gender: 'female', description: 'Natural and expressive' },
      { id: 'en-US-GuyNeural', name: 'Guy Neural', language: 'en-US', gender: 'male', description: 'Clear and professional' },
      { id: 'en-US-AriaNeural', name: 'Aria Neural', language: 'en-US', gender: 'female', description: 'Conversational and friendly' }
    ]
  },
  {
    id: 'google',
    name: 'Google Text-to-Speech',
    description: 'Google Cloud TTS',
    type: 'cloud',
    voices: [
      { id: 'en-US-Wavenet-D', name: 'Wavenet D', language: 'en-US', gender: 'male', description: 'Natural male voice' },
      { id: 'en-US-Wavenet-F', name: 'Wavenet F', language: 'en-US', gender: 'female', description: 'Natural female voice' },
      { id: 'en-US-Neural2-A', name: 'Neural2 A', language: 'en-US', gender: 'male', description: 'Neural male voice' }
    ]
  },
  {
    id: 'web-speech',
    name: 'Web Speech API',
    description: 'Browser native TTS',
    type: 'local',
    voices: [] // Populated dynamically
  },
  {
    id: 'expo-speech',
    name: 'Expo Speech',
    description: 'React Native native TTS',
    type: 'local',
    voices: [] // Populated dynamically
  }
];

class AdvancedTTSService {
  private hfClient: HfInference | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private audioCache = new Map<string, string>();

  constructor() {
    this.initializeServices();
  }

  private async initializeServices() {
    // Initialize Hugging Face client
    if (process.env.HUGGINGFACE_API_KEY) {
      this.hfClient = new HfInference(process.env.HUGGINGFACE_API_KEY);
    }

    // Initialize Web Speech API
    if (Platform.OS === 'web' && 'speechSynthesis' in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  async speak(text: string, config: TTSConfig): Promise<void> {
    
    try {
      switch (config.provider) {
        case 'elevenlabs':
          await this.speakWithElevenLabs(text, config);
          break;
        case 'huggingface':
          await this.speakWithHuggingFace(text, config);
          break;
        case 'openai':
          await this.speakWithOpenAI(text, config);
          break;
        case 'azure':
          await this.speakWithAzure(text, config);
          break;
        case 'google':
          await this.speakWithGoogle(text, config);
          break;
        case 'coqui':
          await this.speakWithCoqui(text, config);
          break;
        case 'web-speech':
          await this.speakWithWebSpeech(text, config);
          break;
        case 'expo-speech':
          await this.speakWithExpo(text, config);
          break;
        default:
          throw new Error(`Unsupported TTS provider: ${config.provider}`);
      }
    } catch (error) {
      console.error(`Error with ${config.provider} TTS:`, error);
      // Fallback to web speech or expo speech
      const fallbackConfig = {
        ...config,
        provider: Platform.OS === 'web' ? 'web-speech' : 'expo-speech'
      };
      await this.speakWithFallback(text, fallbackConfig);
    }
  }

  // ElevenLabs TTS (existing implementation)
  private async speakWithElevenLabs(text: string, config: TTSConfig): Promise<void> {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${config.voice}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': config.apiKey || process.env.ELEVENLABS_API_KEY || '',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: config.stability || 0.5,
          similarity_boost: config.similarityBoost || 0.5,
          style: 0.0,
          use_speaker_boost: true
        },
      }),
    });

    if (response.ok) {
      const audioBlob = await response.blob();
      await this.playAudioBlob(audioBlob);
    } else {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }
  }

  // Hugging Face TTS
  private async speakWithHuggingFace(text: string, config: TTSConfig): Promise<void> {
    if (!this.hfClient) {
      throw new Error('Hugging Face client not initialized. Please set HUGGINGFACE_API_KEY.');
    }

    try {
      const audioBlob = await this.hfClient.textToSpeech({
        model: config.voice,
        inputs: text,
      });

      await this.playAudioBlob(audioBlob);
    } catch (error) {
      console.error('Hugging Face TTS error:', error);
      throw error;
    }
  }

  // OpenAI TTS
  private async speakWithOpenAI(text: string, config: TTSConfig): Promise<void> {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey || process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: config.voice,
        speed: config.speed || 1.0,
        response_format: 'mp3'
      }),
    });

    if (response.ok) {
      const audioBlob = await response.blob();
      await this.playAudioBlob(audioBlob);
    } else {
      throw new Error(`OpenAI TTS API error: ${response.statusText}`);
    }
  }

  // Azure Cognitive Services TTS
  private async speakWithAzure(text: string, config: TTSConfig): Promise<void> {
    // First get access token
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

    // Generate SSML
    const ssml = `
      <speak version='1.0' xml:lang='en-US' xmlns='http://www.w3.org/2001/10/synthesis'
             xmlns:mstts='https://www.w3.org/2001/mstts'>
        <voice name='${config.voice}'>
          <prosody rate='${config.speed || 1.0}' pitch='${config.pitch || 1.0}'>
            ${text}
          </prosody>
        </voice>
      </speak>
    `;

    const response = await fetch(`https://${process.env.AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
      },
      body: ssml,
    });

    if (response.ok) {
      const audioBlob = await response.blob();
      await this.playAudioBlob(audioBlob);
    } else {
      throw new Error(`Azure TTS API error: ${response.statusText}`);
    }
  }

  // Google Cloud TTS
  private async speakWithGoogle(text: string, config: TTSConfig): Promise<void> {
    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${config.apiKey || process.env.GOOGLE_TTS_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: 'en-US',
          name: config.voice,
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: config.speed || 1.0,
          pitch: config.pitch || 0.0,
        },
      }),
    });

    if (response.ok) {
      const result = await response.json();
      const audioData = result.audioContent;
      const audioBlob = this.base64ToBlob(audioData, 'audio/mp3');
      await this.playAudioBlob(audioBlob);
    } else {
      throw new Error(`Google TTS API error: ${response.statusText}`);
    }
  }

  // Coqui TTS (would require running a local server)
  private async speakWithCoqui(text: string, config: TTSConfig): Promise<void> {
    // This assumes you have a Coqui TTS server running locally
    const response = await fetch('http://localhost:5002/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model: config.voice,
        speaker_idx: 0,
        speed: config.speed || 1.0,
      }),
    });

    if (response.ok) {
      const audioBlob = await response.blob();
      await this.playAudioBlob(audioBlob);
    } else {
      throw new Error(`Coqui TTS API error: ${response.statusText}`);
    }
  }

  // Web Speech API (existing implementation)
  private async speakWithWebSpeech(text: string, config: TTSConfig): Promise<void> {
    if (Platform.OS === 'web' && this.synthesis) {
      return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = config.speed || 1.0;
        utterance.pitch = config.pitch || 1.0;
        
        const voices = this.synthesis!.getVoices();
        const selectedVoice = voices.find((voice: SpeechSynthesisVoice) => voice.name === config.voice || voice.voiceURI === config.voice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.onend = () => resolve();
        utterance.onerror = (error) => reject(error);

        this.synthesis!.speak(utterance);
      });
    }
  }

  // Expo Speech (existing implementation)
  private async speakWithExpo(text: string, config: TTSConfig): Promise<void> {
    if (Platform.OS !== 'web') {
      const { Speech } = await import('expo-speech');
      await Speech.speak(text, {
        rate: config.speed || 1.0,
        pitch: config.pitch || 1.0,
        voice: config.voice,
      });
    }
  }

  private async speakWithFallback(text: string, config: TTSConfig): Promise<void> {
    if (Platform.OS === 'web') {
      await this.speakWithWebSpeech(text, config);
    } else {
      await this.speakWithExpo(text, config);
    }
  }

  private async playAudioBlob(audioBlob: Blob): Promise<void> {
    const audioUrl = URL.createObjectURL(audioBlob);
    
    if (Platform.OS === 'web') {
      const audio = new Audio(audioUrl);
      return new Promise((resolve, reject) => {
        audio.onended = () => resolve();
        audio.onerror = reject;
        audio.play().catch(reject);
      });
    } else {
      // Play audio on mobile using Expo AV
      const { Audio } = await import('expo-av');
      const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
      await sound.playAsync();
      
      return new Promise((resolve) => {
        sound.setOnPlaybackStatusUpdate((status: { didJustFinish: boolean }) => {
          if (status.didJustFinish) {
            resolve();
          }
        });
      });
    }
  }

  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  // Get available voices for a specific provider
  async getVoicesForProvider(providerId: string): Promise<TTSVoice[]> {
    const provider = TTS_PROVIDERS.find(p => p.id === providerId);
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }

    if (providerId === 'web-speech' && Platform.OS === 'web' && this.synthesis) {
      const voices = this.synthesis.getVoices();
      return voices.map((voice: SpeechSynthesisVoice) => ({
        id: voice.voiceURI,
        name: voice.name,
        language: voice.lang,
        gender: 'neutral' as const,
        description: `${voice.name} (${voice.lang})`
      }));
    }

    if (providerId === 'expo-speech' && Platform.OS !== 'web') {
      // Return default voices for mobile
      return [
        { id: 'default', name: 'Default', language: 'en-US', gender: 'neutral', description: 'System default voice' }
      ];
    }

    return provider.voices;
  }

  // Test all providers with a sample text
  async testAllProviders(text: string = "Hello, this is a test of the text-to-speech system."): Promise<{ [key: string]: { success: boolean; error?: string; duration?: number } }> {
    const results: { [key: string]: { success: boolean; error?: string; duration?: number } } = {};

    for (const provider of TTS_PROVIDERS) {
      const startTime = Date.now();
      try {
        const defaultVoice = provider.voices[0]?.id || 'default';
        const config: TTSConfig = {
          provider: provider.id,
          voice: defaultVoice,
          speed: 1.0,
          pitch: 1.0
        };

        await this.speak(text, config);
        results[provider.id] = {
          success: true,
          duration: Date.now() - startTime
        };
      } catch (error) {
        results[provider.id] = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    return results;
  }

  // Batch test with different voices
  async batchTest(texts: string[]): Promise<void> {
    console.log('🎤 Starting TTS Batch Test...\n');
    
    for (const provider of TTS_PROVIDERS) {
      console.log(`\n🔊 Testing ${provider.name} (${provider.description})`);
      
      const voices = await this.getVoicesForProvider(provider.id);
      const testVoices = voices.slice(0, 2); // Test first 2 voices to save time
      
      for (const voice of testVoices) {
        console.log(`  └─ Voice: ${voice.name} (${voice.language})`);
        
        for (const text of texts) {
          try {
            const config: TTSConfig = {
              provider: provider.id,
              voice: voice.id,
              speed: 1.0,
              pitch: 1.0
            };
            
            await this.speak(text.substring(0, 50) + (text.length > 50 ? '...' : ''), config);
            console.log(`    ✅ "${text.substring(0, 30)}..."`);
            
            // Add delay between tests
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            console.log(`    ❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }
    }
  }
}

export const advancedTTSService = new AdvancedTTSService();
