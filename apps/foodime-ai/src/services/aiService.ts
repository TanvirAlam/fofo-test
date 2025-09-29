import { ChatConfig, AIProvider } from '../types';

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4, GPT-3.5 Turbo models',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo']
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude models',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku']
  },
  {
    id: 'google',
    name: 'Google AI',
    description: 'Gemini models',
    models: ['gemini-pro', 'gemini-pro-vision']
  }
];

class AIService {
  private openai: unknown;
  private anthropic: unknown;
  private googleAI: unknown;

  constructor() {
    // Initialize AI clients (will be done with API keys from environment)
    this.initializeClients();
  }

  private async initializeClients() {
    try {
      // OpenAI
      const { OpenAI } = await import('openai');
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true // For client-side usage
      });

      // Anthropic
      const { Anthropic } = await import('@anthropic-ai/sdk');
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
        dangerouslyAllowBrowser: true
      });

      // Google AI
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      this.googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
    } catch (error) {
      console.error('Error initializing AI clients:', error);
    }
  }

  async sendMessage(message: string, config: ChatConfig): Promise<string> {
    try {
      switch (config.aiProvider) {
        case 'openai':
          return await this.sendToOpenAI(message, config);
        case 'anthropic':
          return await this.sendToAnthropic(message, config);
        case 'google':
          return await this.sendToGoogle(message, config);
        default:
          throw new Error(`Unsupported AI provider: ${config.aiProvider}`);
      }
    } catch (error) {
      console.error('Error sending message to AI:', error);
      throw error;
    }
  }

  private async sendToOpenAI(message: string, config: ChatConfig): Promise<string> {
    const completion = await this.openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: config.systemPrompt || 'You are a helpful AI assistant.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      model: config.model,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    });

    return completion.choices[0]?.message?.content || 'No response';
  }

  private async sendToAnthropic(message: string, config: ChatConfig): Promise<string> {
    const response = await this.anthropic.messages.create({
      model: config.model,
      max_tokens: config.maxTokens,
      temperature: config.temperature,
      system: config.systemPrompt || 'You are a helpful AI assistant.',
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    });

    return response.content[0]?.text || 'No response';
  }

  private async sendToGoogle(message: string, config: ChatConfig): Promise<string> {
    const model = this.googleAI.getGenerativeModel({ model: config.model });
    const result = await model.generateContent(message);
    const response = await result.response;
    return response.text();
  }
}

export const aiService = new AIService();
