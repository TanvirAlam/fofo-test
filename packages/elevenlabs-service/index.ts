import axios, { AxiosResponse } from 'axios';

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  preview_url?: string;
  category?: string;
  fine_tuning?: {
    language?: string;
  };
}

export interface ElevenLabsVoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

export interface TextToSpeechOptions {
  text: string;
  voice_id: string;
  model_id?: string;
  voice_settings?: ElevenLabsVoiceSettings;
  output_format?: 'mp3_44100_128' | 'mp3_22050_32' | 'pcm_16000' | 'pcm_22050' | 'pcm_24000' | 'pcm_44100';
}

export interface TTSResult {
  success: boolean;
  audioData?: ArrayBuffer;
  sampleRate?: number;
  error?: string;
}

class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ELEVENLABS_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key is required. Set ELEVENLABS_API_KEY environment variable or pass it as a parameter.');
    }
    if (!this.apiKey.startsWith('sk_')) {
      throw new Error('Invalid ElevenLabs API key format. Key should start with "sk_"');
    }
  }

  /**
   * Get available voices from ElevenLabs
   */
  async getVoices(): Promise<ElevenLabsVoice[]> {
    try {
      const response: AxiosResponse<{ voices: ElevenLabsVoice[] }> = await axios.get(
        `${this.baseUrl}/voices`,
        {
          headers: {
            'xi-api-key': this.apiKey,
          },
        }
      );

      return response.data.voices;
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw new Error(`Failed to fetch voices: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Convert text to speech using ElevenLabs API
   */
  async textToSpeech(options: TextToSpeechOptions): Promise<TTSResult> {
    try {
      const {
        text,
        voice_id,
        model_id = 'eleven_turbo_v2',
        voice_settings = {
          stability: 0.5,
          similarity_boost: 0.5,
        },
        output_format = 'mp3_44100_128'
      } = options;

      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${voice_id}/stream`,
        {
          text,
          model_id,
          voice_settings,
          output_format
        },
        {
          headers: {
            'xi-api-key': this.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg',
          },
          responseType: 'arraybuffer',
        }
      );

      if (response.status !== 200) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      // Determine sample rate based on output format
      const sampleRate = output_format.includes('44100') ? 44100 :
                        output_format.includes('22050') ? 22050 :
                        output_format.includes('24000') ? 24000 :
                        output_format.includes('16000') ? 16000 : 44100;

      return {
        success: true,
        audioData: response.data,
        sampleRate
      };
    } catch (error) {
      console.error('Error in text-to-speech conversion:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get voice by ID
   */
  async getVoiceById(voiceId: string): Promise<ElevenLabsVoice | null> {
    try {
      const response: AxiosResponse<ElevenLabsVoice> = await axios.get(
        `${this.baseUrl}/voices/${voiceId}`,
        {
          headers: {
            'xi-api-key': this.apiKey,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Error fetching voice ${voiceId}:`, error);
      return null;
    }
  }

  /**
   * Test connection to ElevenLabs API
   */
  async testConnection(): Promise<boolean> {
    try {
      await axios.get(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Get user subscription info
   */
  async getUserInfo(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/user`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw new Error(`Failed to fetch user info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get available models
   */
  async getModels(): Promise<any[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/models`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw new Error(`Failed to fetch models: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export a default instance and the class for flexibility
export { ElevenLabsService };

// Helper functions for common use cases
export async function createElevenLabsService(apiKey?: string): Promise<ElevenLabsService> {
  const service = new ElevenLabsService(apiKey);
  
  // Test connection on creation
  const isConnected = await service.testConnection();
  if (!isConnected) {
    throw new Error('Failed to connect to ElevenLabs API. Please check your API key.');
  }
  
  return service;
}

export default ElevenLabsService;
