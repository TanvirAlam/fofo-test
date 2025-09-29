# RFLCT AI

A universal speech-to-speech AI assistant that works on both web and mobile platforms.

## Features

- **Multi-Provider AI Support**: OpenAI, Anthropic Claude, and Google Gemini
- **Speech-to-Speech**: Complete voice interaction with speech recognition and text-to-speech
- **Cross-Platform**: Single codebase for web (Next.js) and mobile (Expo/React Native)
- **4-digit RFLCT Codes**: Uses preferred 4-digit format for RFLCT features
- **Real-time Interaction**: Live speech recognition and immediate AI responses

## Tech Stack

- **Framework**: Next.js + Expo (Universal React)
- **Language**: TypeScript
- **AI Providers**: OpenAI, Anthropic, Google AI
- **Speech**: Web Speech API, Expo Speech, ElevenLabs
- **Navigation**: React Navigation
- **Styling**: React Native StyleSheet (universal)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (package manager)
- API keys for AI providers (optional, for full functionality)

### Installation

```bash
# Install dependencies
pnpm install

# For web development
pnpm dev

# For mobile development
pnpm mobile

# For iOS
pnpm mobile:ios

# For Android  
pnpm mobile:android
```

### ML Models

This project uses the Bark TTS model that needs to be downloaded separately due to its size. The model files are not included in the repository and need to be downloaded on first setup.

To download the model, use one of the following commands based on your operating system:

**macOS/Linux:**
```bash
export HUGGINGFACE_API_KEY=your_huggingface_token
python3 download_models.py --download suno/bark-small
```

**Windows (CMD):**
```cmd
set HUGGINGFACE_API_KEY=your_huggingface_token
python download_models.py --download suno/bark-small
```

**Windows (PowerShell):**
```powershell
$env:HUGGINGFACE_API_KEY = "your_huggingface_token"
python download_models.py --download suno/bark-small
```

The script will create the necessary directories and download the model files to the `models/tts/bark-small` directory. These files are gitignored and need to be downloaded separately on each development machine.

You can also use the HUGGINGFACE_API_KEY from your .env.local file if you have it set up.

### Environment Variables

Create a `.env.local` file with your API keys:

```env
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_AI_API_KEY=your_google_key
ELEVENLABS_API_KEY=your_elevenlabs_key
```

## Usage

1. **Start the app** - Launch on web or mobile
2. **Navigate to Chat** - Begin AI conversation
3. **Speak or Type** - Use microphone or keyboard input
4. **Hear Responses** - AI responses are automatically spoken
5. **Configure Settings** - Adjust AI provider, model, and speech settings

## Architecture

```
src/
├── components/        # React components
│   ├── HomeScreen.tsx
│   ├── ChatScreen.tsx
│   └── SettingsScreen.tsx
├── services/          # Business logic
│   ├── aiService.ts   # AI provider integration
│   └── speechService.ts # Speech functionality
├── types/             # TypeScript definitions
└── utils/             # Helper functions
```

## RFLCT Integration

This app is designed to work with RFLCT systems using 4-digit codes:

- **Code Format**: RFLCT-1234 (4 digits)
- **Speech Recognition**: Understands RFLCT voice commands
- **Response Format**: AI provides RFLCT-compatible responses

## Platform-Specific Features

### Web
- Web Speech API for speech recognition
- Web Audio API for advanced audio features
- Browser-based AI API calls

### Mobile
- Expo Speech for text-to-speech
- Native audio permissions
- Mobile-optimized UI

## Development

### Building

```bash
# Build for web
pnpm build

# Build for mobile
pnpm mobile build
```

### Testing

```bash
# Run tests
pnpm test

# Run with coverage
pnpm test:coverage
```

### Linting

```bash
# Lint code
pnpm lint

# Type checking
pnpm check-types
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both web and mobile
5. Submit a pull request

## License

This project is part of the foodime-turbo monorepo.

MAC & LINUX:
RUN: `export HUGGINGFACE_API_KEY=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 && python3 download_models.py --download suno/bark-small`

WINDOWS:

cmd:
```
set HUGGINGFACE_API_KEY=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
python models/download_models.py --download suno/bark-small
```

Powershal
```
$env:HUGGINGFACE_API_KEY = "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"
python models/download_models.py --download suno/bark-small
```

