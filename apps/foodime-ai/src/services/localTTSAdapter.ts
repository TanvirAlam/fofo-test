import { Platform } from 'react-native';
import { loadModel, generateTTS } from '@huggingface/inference';
import { TTSConfig } from './advancedTTSService';

export interface TTSResult {
  audioData: ArrayBuffer;
  sampleRate: number;
  success: boolean;
  error?: string;
}

export interface LocalTTSConfig extends TTSConfig {
  useCache?: boolean;
  batchSize?: number;
  outputFormat?: 'wav' | 'mp3';
  device?: 'cpu' | 'gpu';
  stream?: boolean;
}

/**
 * Adapter service for local TTS models.
 * This service manages the downloaded Hugging Face models and provides
 * a unified interface for generating speech using local models.
 */
class LocalTTSAdapter {
  private models: Map<string, HfInference> = new Map();
  private audioCache: Map<string, ArrayBuffer> = new Map();
  private isInitialized = false;
  private readonly MODELS_PATH = Platform.OS === 'web' 
    ? '/models/tts'
    : 'models/tts';

  /**
   * Initialize the local TTS models
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🔧 Initializing local TTS models...');

      // Load Bark small model
      const barkModel = await loadModel('suno/bark-small', {
        cache: true,
        local: true,
        baseUrl: this.MODELS_PATH + '/bark-small'
      });
      this.models.set('bark', barkModel);

      // Load FastSpeech2 model
      const fastSpeechModel = await loadModel('facebook/fastspeech2-en-ljspeech', {
        cache: true,
        local: true,
        baseUrl: this.MODELS_PATH + '/fastspeech2-en-ljspeech'
      });
      this.models.set('fastspeech2', fastSpeechModel);

      this.isInitialized = true;
      console.log('✅ Local TTS models initialized');

    } catch (error) {
      console.error('❌ Error initializing local TTS models:', error);
      throw error;
    }
  }

  /**
   * Generate speech from text using a local model
   */
  async generateSpeech(text: string, config: LocalTTSConfig): Promise<TTSResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const cacheKey = this.getCacheKey(text, config);
    if (config.useCache && this.audioCache.has(cacheKey)) {
      return {
        audioData: this.audioCache.get(cacheKey)!,
        sampleRate: 24000,
        success: true
      };
    }

    try {
      let audioData: ArrayBuffer;
      let sampleRate = 24000;

      switch (config.provider) {
        case 'bark':
          const barkModel = this.models.get('bark');
          if (!barkModel) throw new Error('Bark model not loaded');

          const barkOutput = await generateTTS(barkModel, {
            inputs: text,
            parameters: {
              voice: this.getBarkVoice(config.voice),
              temperature: 0.7,
              waveform_temperature: 0.7,
              output_type: config.outputFormat || 'wav',
              ...(config.stream && { stream: true })
            }
          });

          audioData = barkOutput.audio;
          sampleRate = 24000;
          break;

        case 'fastspeech2':
          const fastSpeechModel = this.models.get('fastspeech2');
          if (!fastSpeechModel) throw new Error('FastSpeech2 model not loaded');

          const fastSpeechOutput = await generateTTS(fastSpeechModel, {
            inputs: text,
            parameters: {
              pitch: config.pitch,
              speed: config.speed,
              output_type: config.outputFormat || 'wav'
            }
          });

          audioData = fastSpeechOutput.audio;
          sampleRate = 22050;
          break;

        default:
          throw new Error(`Unsupported local TTS provider: ${config.provider}`);
      }

      if (config.useCache) {
        this.audioCache.set(cacheKey, audioData);
      }

      return {
        audioData,
        sampleRate,
        success: true
      };

    } catch (error) {
      console.error(`Error generating speech with ${config.provider}:`, error);
      return {
        audioData: new ArrayBuffer(0),
        sampleRate: 24000,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Clear the audio cache
   */
  clearCache(): void {
    this.audioCache.clear();
  }

  /**
   * Get cache key for a specific text and config
   */
  private getCacheKey(text: string, config: LocalTTSConfig): string {
    return `${config.provider}_${config.voice}_${config.speed}_${config.pitch}_${text}`;
  }

  /**
   * Get Bark voice ID from config
   */
  private getBarkVoice(voice: string): string {
    // Map voice name to Bark's speaker embeddings
    const [lang, speakerId] = voice.split('_');
    const langMap: { [key: string]: string } = {
      'en': 'en_speaker',
      'de': 'de_speaker',
      'es': 'es_speaker',
      'fr': 'fr_speaker',
      'hi': 'hi_speaker',
      'it': 'it_speaker',
      'ja': 'ja_speaker',
      'ko': 'ko_speaker',
      'pl': 'pl_speaker',
      'pt': 'pt_speaker',
      'ru': 'ru_speaker',
      'tr': 'tr_speaker',
      'zh': 'zh_speaker'
    };

    const languagePrefix = langMap[lang] || 'en_speaker';
    const id = speakerId || '0';
    return `${languagePrefix}_${id}`;
  }

  /**
   * Get available voices for a provider
   */
  getAvailableVoices(provider: string): Array<{id: string; name: string; language: string}> {
    switch (provider) {
      case 'bark':
        return [
          // English voices
          { id: 'en_0', name: 'English Male 1', language: 'en' },
          { id: 'en_1', name: 'English Female 1', language: 'en' },
          { id: 'en_2', name: 'English Male 2', language: 'en' },
          { id: 'en_3', name: 'English Female 2', language: 'en' },
          // German voices
          { id: 'de_0', name: 'German Male 1', language: 'de' },
          { id: 'de_1', name: 'German Female 1', language: 'de' },
          // Spanish voices
          { id: 'es_0', name: 'Spanish Male 1', language: 'es' },
          { id: 'es_1', name: 'Spanish Female 1', language: 'es' },
          // French voices
          { id: 'fr_0', name: 'French Male 1', language: 'fr' },
          { id: 'fr_1', name: 'French Female 1', language: 'fr' },
          // Italian voices
          { id: 'it_0', name: 'Italian Male 1', language: 'it' },
          { id: 'it_1', name: 'Italian Female 1', language: 'it' }
        ];

      case 'fastspeech2':
        return [
          { id: 'ljspeech', name: 'LJSpeech Female', language: 'en' }
        ];

      default:
        return [];
    }
  }

  /**
   * Get supported languages for a provider
   */
  getSupportedLanguages(provider: string): string[] {
    switch (provider) {
      case 'bark':
        return ['en', 'de', 'es', 'fr', 'hi', 'it', 'ja', 'ko', 'pl', 'pt', 'ru', 'tr', 'zh'];
      case 'fastspeech2':
        return ['en'];
      default:
        return [];
    }
  }

  /**
   * Test a specific voice
   */
  async testVoice(
    provider: string,
    voiceId: string,
    text: string = 'Hello! I am a text-to-speech test.'
  ): Promise<TTSResult> {
    const config: LocalTTSConfig = {
      provider,
      voice: voiceId,
      speed: 1.0,
      pitch: 1.0,
      useCache: false,
      outputFormat: 'wav'
    };

    return this.generateSpeech(text, config);
  }

  /**
   * Batch test multiple voices
   */
  async batchTestVoices(
    provider: string,
    texts: string[] = [
      'Hello! Welcome to Foodime!',
      'I would like to order a large pepperoni pizza.',
      'Your order will be ready in 30 minutes.',
      'Thank you for choosing Foodime!'
    ]
  ): Promise<{ [key: string]: TTSResult[] }> {
    const voices = this.getAvailableVoices(provider);
    const results: { [key: string]: TTSResult[] } = {};

    for (const voice of voices) {
      results[voice.id] = [];
      for (const text of texts) {
        const result = await this.testVoice(provider, voice.id, text);
        results[voice.id].push(result);
      }
    }

    return results;
  }
}

// Export singleton instance
export const localTTSAdapter = new LocalTTSAdapter();
