import axios from 'axios';

interface TTSResult {
  success: boolean;
  audioData?: ArrayBuffer;
  sampleRate?: number;
  error?: string;
}

class TTSAdapter {
  private isInitialized = false;
  private apiKey: string | null = null;

  constructor() {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY environment variable is not set');
    }
    if (!apiKey.startsWith('sk_')) {
      throw new Error('Invalid ElevenLabs API key format. Key should start with "sk_"');
    }
    this.apiKey = apiKey;
    console.log('Using API key format:', this.apiKey.substring(0, 5) + '...');
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      if (!this.apiKey) {
        throw new Error('ELEVENLABS_API_KEY is not set');
      }

      // Test connection with a simple request
      await axios.get('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': this.apiKey
        }
      });

      this.isInitialized = true;
      console.log('✅ TTS Adapter initialized');
    } catch (error) {
      console.error('❌ Failed to initialize TTS:', error);
      throw error;
    }
  }

  async testVoice(provider: string, voiceId: string, text: string): Promise<TTSResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      let audioData: ArrayBuffer;
      let sampleRate = 44100; // Default sample rate for ElevenLabs

      if (!this.apiKey) {
        throw new Error('ELEVENLABS_API_KEY is not set');
      }
      
      console.log('Current API Key:', this.apiKey);

      switch (provider) {
        case 'elevenlabs':
          console.log('Generating speech with ElevenLabs...');
          console.log('Using voice ID:', voiceId);
          console.log('Using text:', text);
          
          const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
            {
              text,
              model_id: 'eleven_turbo_v2',
              output_format: 'mp3_44100_128'
            },
            {
              headers: {
                'xi-api-key': this.apiKey,
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg'
              },
              responseType: 'arraybuffer'
            }
          );
          
          if (response.status !== 200) {
            console.error('ElevenLabs API error:', response.status);
            console.error('Response headers:', response.headers);
            if (response.data instanceof Buffer) {
              console.error('Response data:', response.data.toString('utf8'));
            } else {
              console.error('Response data:', response.data);
            }
            throw new Error(`ElevenLabs API error: ${response.status}`);
          }
          
          console.log('Speech generated successfully!');
          audioData = response.data;
          sampleRate = 44100;
          break;

        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      return {
        success: true,
        audioData,
        sampleRate
      };

    } catch (error) {
      console.error('TTS test failed:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response:', error.response?.data);
        console.error('Status:', error.response?.status);
        console.error('Headers:', error.response?.headers);
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getAvailableVoices(provider: string): Promise<Array<{id: string; name: string; language: string}>> {
    switch (provider) {
      case 'elevenlabs':
        if (!this.apiKey) {
          throw new Error('ElevenLabs API key not set');
        }
        const response = await axios.get('https://api.elevenlabs.io/v1/voices', {
          headers: {
            'xi-api-key': this.apiKey
          }
        });
        const voices = response.data.voices;
        return voices.map((voice: { voice_id: string; name: string; }) => ({
          id: voice.voice_id,
          name: voice.name,
          language: 'en'
        }));

      default:
        return [];
    }
  }

  getSupportedLanguages(provider: string): string[] {
    switch (provider) {
      case 'elevenlabs':
        return ['en'];
      default:
        return [];
    }
  }
}

export const ttsAdapter = new TTSAdapter();
