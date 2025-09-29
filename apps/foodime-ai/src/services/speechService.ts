import { Platform } from 'react-native';
import { SpeechConfig } from '../types';

class SpeechService {
  private recognition: unknown;
  private synthesis: unknown;
  private isListening = false;

  constructor() {
    this.initializeSpeechServices();
  }

  private async initializeSpeechServices() {
    if (Platform.OS === 'web') {
      // Web Speech API
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';
      }

      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis;
      }
    } else {
      // React Native (Expo)
      try {
        const { Audio } = await import('expo-av');
        await Audio.requestPermissionsAsync();
      } catch (error) {
        console.error('Error requesting audio permissions:', error);
      }
    }
  }

  async startListening(onResult: (text: string) => void, onEnd?: () => void): Promise<void> {
    if (this.isListening) return;

    try {
      if (Platform.OS === 'web' && this.recognition) {
        this.recognition.onresult = (event: unknown) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            }
          }
          if (finalTranscript) {
            onResult(finalTranscript);
          }
        };

        this.recognition.onend = () => {
          this.isListening = false;
          onEnd?.();
        };

        this.recognition.start();
        this.isListening = true;
      } else {
        // Use Expo Audio for mobile
        await import('expo-av');
        // Implementation for mobile speech recognition would go here
        // This would typically use a cloud service like Google Speech-to-Text
      }
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      throw error;
    }
  }

  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
    this.isListening = false;
  }

  async speak(text: string, config: SpeechConfig): Promise<void> {
    try {
      switch (config.provider) {
        case 'web-speech':
          await this.speakWithWebSpeech(text, config);
          break;
        case 'expo-speech':
          await this.speakWithExpo(text, config);
          break;
        case 'elevenlabs':
          await this.speakWithElevenLabs(text, config);
          break;
        default:
          throw new Error(`Unsupported speech provider: ${config.provider}`);
      }
    } catch (error) {
      console.error('Error speaking text:', error);
      throw error;
    }
  }

  private async speakWithWebSpeech(text: string, config: SpeechConfig): Promise<void> {
    if (Platform.OS === 'web' && this.synthesis) {
      return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = config.speed;
        utterance.pitch = config.pitch;
        
        const voices = this.synthesis.getVoices();
        const selectedVoice = voices.find((voice: { name: string }) => voice.name === config.voice);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }

        utterance.onend = () => resolve();
        utterance.onerror = (error) => reject(error);

        this.synthesis.speak(utterance);
      });
    }
  }

  private async speakWithExpo(text: string, config: SpeechConfig): Promise<void> {
    if (Platform.OS !== 'web') {
      const { Speech } = await import('expo-speech');
      await Speech.speak(text, {
        rate: config.speed,
        pitch: config.pitch,
        voice: config.voice,
      });
    }
  }

  private async speakWithElevenLabs(text: string, config: SpeechConfig): Promise<void> {
    try {
      // This would integrate with ElevenLabs API
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + config.voice, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (Platform.OS === 'web') {
          const audio = new Audio(audioUrl);
          await audio.play();
        } else {
          // Play audio on mobile using Expo AV
          const { Audio } = await import('expo-av');
          const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
          await sound.playAsync();
        }
      }
    } catch (error) {
      console.error('Error with ElevenLabs TTS:', error);
      // Fallback to default speech synthesis
      await this.speakWithWebSpeech(text, { ...config, provider: 'web-speech' });
    }
  }

  getAvailableVoices(): Promise<{ name: string; lang?: string }[]> {
    return new Promise((resolve) => {
      if (Platform.OS === 'web' && this.synthesis) {
        const voices = this.synthesis.getVoices();
        resolve(voices);
      } else {
        // Return default voices for mobile
        resolve([
          { name: 'default', lang: 'en-US' }
        ]);
      }
    });
  }

  isListeningActive(): boolean {
    return this.isListening;
  }
}

export const speechService = new SpeechService();
