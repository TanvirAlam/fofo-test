#!/usr/bin/env node

/**
 * Foodime AI API Keys Setup Script
 * 
 * This script helps you:
 * 1. Check which API keys are configured
 * 2. Test API connectivity
 * 3. Get direct links to obtain API keys
 * 4. Show fallback options when keys aren't available
 */

const fs = require('fs');
const path = require('path');

const ENV_FILE = path.join(__dirname, '.env.local');

// API Key providers configuration
const API_PROVIDERS = {
  // High Priority
  OPENAI_API_KEY: {
    name: 'OpenAI',
    priority: 'HIGH',
    description: 'Enables GPT-4 AI, Whisper STT, and OpenAI TTS',
    signup_url: 'https://platform.openai.com/api-keys',
    free_tier: false,
    cost: '$0.002/1K tokens (GPT-4)',
    fallback: 'Web Speech API for TTS/STT'
  },
  
  // Medium Priority  
  ELEVENLABS_API_KEY: {
    name: 'ElevenLabs',
    priority: 'MEDIUM',
    description: 'Premium AI voices with emotional control',
    signup_url: 'https://elevenlabs.io/app/settings/api-keys',
    free_tier: true,
    cost: '10,000 chars/month free, then $1/1K chars',
    fallback: 'OpenAI TTS or Web Speech API'
  },
  
  HUGGINGFACE_API_KEY: {
    name: 'Hugging Face',
    priority: 'MEDIUM',
    description: 'Open-source AI models with free tier',
    signup_url: 'https://huggingface.co/settings/tokens',
    free_tier: true,
    cost: 'Free tier available with rate limits',
    fallback: 'OpenAI models'
  },

  // Low Priority (Optional)
  ANTHROPIC_API_KEY: {
    name: 'Anthropic Claude',
    priority: 'LOW',
    description: 'Alternative AI provider (Claude models)',
    signup_url: 'https://console.anthropic.com/',
    free_tier: true,
    cost: 'Free credits, then $0.25/1M tokens',
    fallback: 'OpenAI GPT-4'
  },
  
  GOOGLE_AI_API_KEY: {
    name: 'Google AI',
    priority: 'LOW', 
    description: 'Gemini models for AI processing',
    signup_url: 'https://makersuite.google.com/app/apikey',
    free_tier: true,
    cost: 'Free tier available',
    fallback: 'OpenAI GPT-4'
  },
  
  GOOGLE_TTS_API_KEY: {
    name: 'Google Cloud TTS',
    priority: 'LOW',
    description: 'WaveNet voices for text-to-speech',
    signup_url: 'https://console.cloud.google.com/apis/credentials',
    free_tier: true,
    cost: '$16/1M characters after free tier',
    fallback: 'Web Speech API'
  },
  
  GOOGLE_STT_API_KEY: {
    name: 'Google Cloud STT',
    priority: 'LOW',
    description: 'Speech recognition with advanced features',
    signup_url: 'https://console.cloud.google.com/apis/credentials',
    free_tier: true,
    cost: '$2.88/hour after free tier',
    fallback: 'OpenAI Whisper or Web Speech API'
  },
  
  AZURE_SPEECH_KEY: {
    name: 'Azure Speech',
    priority: 'LOW',
    description: 'Microsoft neural voices and speech recognition',
    signup_url: 'https://azure.microsoft.com/en-us/services/cognitive-services/speech-services/',
    free_tier: true,
    cost: '5 hours free/month, then $1/hour',
    fallback: 'OpenAI or Web Speech API'
  },
  
  DEEPGRAM_API_KEY: {
    name: 'Deepgram',
    priority: 'LOW',
    description: 'Fast, accurate speech recognition',
    signup_url: 'https://console.deepgram.com/',
    free_tier: true,
    cost: '$0.0125/minute after free credits',
    fallback: 'OpenAI Whisper'
  }
};

function loadEnvFile() {
  try {
    if (!fs.existsSync(ENV_FILE)) {
      console.log('❌ .env.local file not found');
      return {};
    }
    
    const envContent = fs.readFileSync(ENV_FILE, 'utf8');
    const env = {};
    
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([A-Z_]+)=(.*)$/);
      if (match) {
        env[match[1]] = match[2];
      }
    });
    
    return env;
  } catch (error) {
    console.error('Error reading .env.local:', error.message);
    return {};
  }
}

function checkAPIKeys() {
  console.log('\n🔍 CHECKING API KEY CONFIGURATION\n');
  
  const env = loadEnvFile();
  const configured = [];
  const missing = [];
  
  Object.entries(API_PROVIDERS).forEach(([key, info]) => {
    const value = env[key];
    const isConfigured = value && value !== `your_${key.toLowerCase()}_here` && value.length > 10;
    
    if (isConfigured) {
      configured.push({ key, info, value: value.substring(0, 10) + '...' });
    } else {
      missing.push({ key, info });
    }
  });
  
  // Show configured keys
  if (configured.length > 0) {
    console.log('✅ CONFIGURED API KEYS:\n');
    configured.forEach(({ key, info, value }) => {
      console.log(`   ${info.name} (${info.priority} priority)`);
      console.log(`   └─ ${key}: ${value}`);
      console.log(`   └─ ${info.description}\n`);
    });
  }
  
  // Show missing keys by priority
  if (missing.length > 0) {
    console.log('❌ MISSING API KEYS:\n');
    
    const priorities = ['HIGH', 'MEDIUM', 'LOW'];
    priorities.forEach(priority => {
      const priorityKeys = missing.filter(({ info }) => info.priority === priority);
      if (priorityKeys.length > 0) {
        console.log(`   ${priority} PRIORITY:`);
        priorityKeys.forEach(({ key, info }) => {
          console.log(`   📍 ${info.name}`);
          console.log(`   └─ Description: ${info.description}`);
          console.log(`   └─ Get key: ${info.signup_url}`);
          console.log(`   └─ Cost: ${info.cost}`);
          console.log(`   └─ Fallback: ${info.fallback}\n`);
        });
      }
    });
  }
  
  return { configured: configured.length, total: Object.keys(API_PROVIDERS).length };
}

function showQuickStart() {
  console.log('\n🚀 QUICK START RECOMMENDATIONS\n');
  
  console.log('💡 MINIMUM VIABLE SETUP (Works with just browser APIs):');
  console.log('   • No API keys needed!');
  console.log('   • Uses Web Speech API (built into browsers)');
  console.log('   • Perfect for testing the order processing flow');
  console.log('   • Limited voice quality but fully functional\n');
  
  console.log('⭐ RECOMMENDED SETUP (Best experience):');
  console.log('   1. Get OPENAI_API_KEY first');
  console.log('      └─ Enables GPT-4 AI + Whisper STT + OpenAI TTS');
  console.log('      └─ Cost: ~$0.02 per order conversation');
  console.log('   2. Add ELEVENLABS_API_KEY for premium voices');
  console.log('      └─ 10,000 characters free per month');
  console.log('      └─ Significant voice quality improvement\n');
  
  console.log('🎯 PROFESSIONAL SETUP (All features):');
  console.log('   • Add multiple providers for redundancy');
  console.log('   • Azure/Google for enterprise features');
  console.log('   • Deepgram for fast real-time STT');
  console.log('   • Hugging Face for open-source options\n');
}

function showTestingInstructions() {
  console.log('\n🧪 TESTING INSTRUCTIONS\n');
  
  console.log('1. Start the development server:');
  console.log('   cd /Users/tanviralam/Projects/foodime/apps/foodime-ai');
  console.log('   pnpm start\n');
  
  console.log('2. Open your browser and navigate to the AI Testing Suite\n');
  
  console.log('3. Test without API keys:');
  console.log('   └─ Web Speech API will work in Chrome/Edge');
  console.log('   └─ You can test the complete order flow');
  console.log('   └─ Voice quality will be basic but functional\n');
  
  console.log('4. Test with API keys:');
  console.log('   └─ Compare voice quality across providers');
  console.log('   └─ Test speech recognition accuracy');
  console.log('   └─ Experience premium AI conversations\n');
}

function showFallbackInfo() {
  console.log('\n🔄 FALLBACK SYSTEM\n');
  
  console.log('The system is designed to work gracefully with missing API keys:\n');
  
  console.log('🔊 TEXT-TO-SPEECH FALLBACKS:');
  console.log('   1. ElevenLabs (premium quality)');
  console.log('   2. OpenAI TTS (high quality)');
  console.log('   3. Azure/Google TTS (good quality)');
  console.log('   4. Web Speech API (basic, always available)\n');
  
  console.log('🎤 SPEECH-TO-TEXT FALLBACKS:');
  console.log('   1. OpenAI Whisper (best accuracy)');
  console.log('   2. Google/Azure/Deepgram STT');
  console.log('   3. Web Speech API (basic, always available)\n');
  
  console.log('🤖 AI PROCESSING FALLBACKS:');
  console.log('   1. OpenAI GPT-4 (best understanding)');
  console.log('   2. Anthropic Claude');
  console.log('   3. Google Gemini');
  console.log('   4. Basic rule-based processing\n');
}

function main() {
  console.log('🍕 FOODIME AI SETUP ASSISTANT\n');
  console.log('═══════════════════════════════════════════════════════');
  
  const { configured, total } = checkAPIKeys();
  
  console.log(`\n📊 SUMMARY: ${configured}/${total} API keys configured\n`);
  
  if (configured === 0) {
    console.log('🎉 Good news! You can test the system without any API keys.');
    console.log('The Web Speech API (built into browsers) will handle TTS and STT.\n');
  } else if (configured < 3) {
    console.log('🌟 Great start! You have some API keys configured.');
    console.log('Consider adding a few more for the best experience.\n');
  } else {
    console.log('🚀 Excellent! You have most API keys configured.');
    console.log('You\'ll experience the full power of the Foodime AI system.\n');
  }
  
  showQuickStart();
  showFallbackInfo();
  showTestingInstructions();
  
  console.log('═══════════════════════════════════════════════════════');
  console.log('💬 Need help? Check the AI_MODELS_DOCUMENTATION.md file');
  console.log('🐛 Issues? Use the testing suite to diagnose problems');
  console.log('⚡ Ready? Run: pnpm start');
}

if (require.main === module) {
  main();
}

module.exports = { checkAPIKeys, loadEnvFile, API_PROVIDERS };
