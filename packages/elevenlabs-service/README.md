# ElevenLabs Service

A TypeScript service for integrating with the ElevenLabs Text-to-Speech API in the Foodime project.

## Features

- 🎵 Text-to-speech conversion with high-quality AI voices
- 🎤 Voice management (list, search by ID)
- 🔧 Connection testing and health checks
- 📊 User info and subscription details
- 🛡️ Full TypeScript support with type definitions
- ✅ Comprehensive unit tests
- 🎛️ Configurable output formats and voice settings

## Installation

This package is part of the Foodime monorepo and uses pnpm workspaces:

```bash
pnpm install
```

## Usage

### Basic Setup

```typescript
import { ElevenLabsService, createElevenLabsService } from 'elevenlabs-service';

// Option 1: Using constructor (requires API key)
const service = new ElevenLabsService('sk_your_api_key_here');

// Option 2: Using environment variable
process.env.ELEVENLABS_API_KEY = 'sk_your_api_key_here';
const service = new ElevenLabsService();

// Option 3: Using factory function (includes connection test)
const service = await createElevenLabsService('sk_your_api_key_here');
```

### Text-to-Speech Conversion

```typescript
const result = await service.textToSpeech({
  text: 'Hello, welcome to Foodime! What would you like to order today?',
  voice_id: 'EXAVITQu4vr4xnSDxMaL', // Bella voice
  model_id: 'eleven_turbo_v2', // Optional, defaults to eleven_turbo_v2
  voice_settings: { // Optional
    stability: 0.5,
    similarity_boost: 0.5
  },
  output_format: 'mp3_44100_128' // Optional, defaults to mp3_44100_128
});

if (result.success) {
  console.log('Audio generated successfully!');
  console.log('Sample rate:', result.sampleRate);
  // result.audioData contains the ArrayBuffer with audio data
} else {
  console.error('Error:', result.error);
}
```

### Voice Management

```typescript
// Get all available voices
const voices = await service.getVoices();
console.log(voices);

// Get specific voice by ID
const voice = await service.getVoiceById('EXAVITQu4vr4xnSDxMaL');
if (voice) {
  console.log(`Voice: ${voice.name}`);
}
```

### Health Checks

```typescript
// Test API connection
const isConnected = await service.testConnection();
console.log('API connected:', isConnected);

// Get user info and subscription details
const userInfo = await service.getUserInfo();
console.log('Subscription:', userInfo.subscription);
```

## Configuration

### Environment Variables

- `ELEVENLABS_API_KEY`: Your ElevenLabs API key (required, must start with 'sk_')

### Supported Output Formats

- `mp3_44100_128` (default)
- `mp3_22050_32`
- `pcm_16000`
- `pcm_22050`
- `pcm_24000`
- `pcm_44100`

### Voice Settings

- `stability` (0.0-1.0): How stable the voice should be
- `similarity_boost` (0.0-1.0): How much to boost similarity to the original voice
- `style` (optional, 0.0-1.0): Style exaggeration
- `use_speaker_boost` (optional, boolean): Whether to use speaker boost

## API Reference

### ElevenLabsService

#### Constructor
- `new ElevenLabsService(apiKey?: string)`

#### Methods
- `getVoices(): Promise<ElevenLabsVoice[]>` - Get all available voices
- `textToSpeech(options: TextToSpeechOptions): Promise<TTSResult>` - Convert text to speech
- `getVoiceById(voiceId: string): Promise<ElevenLabsVoice | null>` - Get voice by ID
- `testConnection(): Promise<boolean>` - Test API connection
- `getUserInfo(): Promise<any>` - Get user subscription info
- `getModels(): Promise<any[]>` - Get available models

#### Helper Functions
- `createElevenLabsService(apiKey?: string): Promise<ElevenLabsService>` - Factory function with connection test

## Development

### Scripts

- `pnpm build` - Build TypeScript to `dist/`
- `pnpm test` - Run Jest unit tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm lint` - Run ESLint
- `pnpm clean` - Clean build directory

### Testing

The service includes comprehensive unit tests covering:
- Constructor validation
- API error handling
- Voice fetching and management
- Text-to-speech conversion
- Connection testing
- User info retrieval

Run tests with:
```bash
pnpm test
```

## License

ISC
