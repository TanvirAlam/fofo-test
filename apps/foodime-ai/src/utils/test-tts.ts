#!/usr/bin/env node

import { localTTSAdapter } from '../services/localTTSAdapter';

async function testLocalTTS() {
  try {
    // Initialize adapter
    await localTTSAdapter.initialize();
    console.log('\n🎯 Testing Local TTS Models\n');

    // Test Bark English voices
    console.log('🗣️ Testing Bark English Voices:');
    const barkVoices = localTTSAdapter.getAvailableVoices('bark')
      .filter(v => v.language === 'en');

    for (const voice of barkVoices) {
      console.log(`\n👤 Testing ${voice.name}...`);
      const result = await localTTSAdapter.testVoice('bark', voice.id);
      console.log(`   Status: ${result.success ? '✅ Success' : '❌ Failed'}`);
      if (!result.success) {
        console.log(`   Error: ${result.error}`);
      }
    }

    // Test FastSpeech2
    console.log('\n🗣️ Testing FastSpeech2:');
    const fastSpeechVoices = localTTSAdapter.getAvailableVoices('fastspeech2');
    for (const voice of fastSpeechVoices) {
      console.log(`\n👤 Testing ${voice.name}...`);
      const result = await localTTSAdapter.testVoice('fastspeech2', voice.id);
      console.log(`   Status: ${result.success ? '✅ Success' : '❌ Failed'}`);
      if (!result.success) {
        console.log(`   Error: ${result.error}`);
      }
    }

    // Test voices with restaurant-specific phrases
    console.log('\n🍕 Testing Restaurant Phrases:\n');
    const phrases = [
      'Welcome to Foodime! How may I help you today?',
      'Would you like to order our special pepperoni pizza?',
      'Your total comes to twenty-four dollars and ninety-nine cents.',
      'Your order will be ready in about 30 minutes.',
      'Thank you for choosing Foodime! Have a great day!'
    ];

    console.log('📢 Testing with Bark (English Female 1):');
    for (const phrase of phrases) {
      console.log(`\n🗨️ "${phrase}"`);
      const result = await localTTSAdapter.testVoice('bark', 'en_1', phrase);
      console.log(`   Status: ${result.success ? '✅ Success' : '❌ Failed'}`);
      if (!result.success) {
        console.log(`   Error: ${result.error}`);
      }
    }

    console.log('\n📢 Testing with FastSpeech2:');
    for (const phrase of phrases) {
      console.log(`\n🗨️ "${phrase}"`);
      const result = await localTTSAdapter.testVoice('fastspeech2', 'ljspeech', phrase);
      console.log(`   Status: ${result.success ? '✅ Success' : '❌ Failed'}`);
      if (!result.success) {
        console.log(`   Error: ${result.error}`);
      }
    }

    // Test emotion variation with Bark
    console.log('\n😊 Testing Emotion Variations with Bark:\n');
    const emotions = ['neutral', 'happy', 'professional'];
    const testPhrase = 'Welcome to Foodime! I\'d be happy to take your order.';

    for (const emotion of emotions) {
      console.log(`\n🎭 Testing ${emotion} voice...`);
      const config = {
        provider: 'bark',
        voice: 'en_1',
        speed: 1.0,
        pitch: 1.0,
        emotion
      };
      const result = await localTTSAdapter.generateSpeech(testPhrase, config);
      console.log(`   Status: ${result.success ? '✅ Success' : '❌ Failed'}`);
      if (!result.success) {
        console.log(`   Error: ${result.error}`);
      }
    }

    console.log('\n✨ TTS Testing Complete!\n');

  } catch (error) {
    console.error('❌ Error testing TTS:', error);
  }
}

testLocalTTS();
