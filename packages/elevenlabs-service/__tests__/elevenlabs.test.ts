import axios from 'axios';
import { ElevenLabsService, createElevenLabsService, ElevenLabsVoice, TextToSpeechOptions } from '../index';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock console.error to suppress expected error logs during testing
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('ElevenLabsService', () => {
  const mockApiKey = 'sk_test_api_key_12345';
  let service: ElevenLabsService;

  beforeEach(() => {
    jest.clearAllMocks();
    // Set environment variable for tests
    process.env.ELEVENLABS_API_KEY = mockApiKey;
  });

  afterEach(() => {
    delete process.env.ELEVENLABS_API_KEY;
  });

  describe('constructor', () => {
    it('should initialize with API key from environment variable', () => {
      expect(() => new ElevenLabsService()).not.toThrow();
    });

    it('should initialize with provided API key', () => {
      const customKey = 'sk_custom_key_67890';
      const service = new ElevenLabsService(customKey);
      expect(service).toBeInstanceOf(ElevenLabsService);
    });

    it('should throw error when no API key is provided', () => {
      delete process.env.ELEVENLABS_API_KEY;
      expect(() => new ElevenLabsService()).toThrow('ElevenLabs API key is required');
    });

    it('should throw error when API key format is invalid', () => {
      const invalidKey = 'invalid_key_format';
      expect(() => new ElevenLabsService(invalidKey)).toThrow('Invalid ElevenLabs API key format');
    });
  });

  describe('getVoices', () => {
    beforeEach(() => {
      service = new ElevenLabsService(mockApiKey);
    });

    it('should fetch and return voices successfully', async () => {
      const mockVoices: ElevenLabsVoice[] = [
        {
          voice_id: 'voice1',
          name: 'Alice',
          category: 'generated'
        },
        {
          voice_id: 'voice2',
          name: 'Bob',
          category: 'professional'
        }
      ];

      mockedAxios.get.mockResolvedValueOnce({
        data: { voices: mockVoices },
        status: 200
      });

      const voices = await service.getVoices();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.elevenlabs.io/v1/voices',
        {
          headers: {
            'xi-api-key': mockApiKey,
          },
        }
      );
      expect(voices).toEqual(mockVoices);
    });

    it('should handle API errors when fetching voices', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(service.getVoices()).rejects.toThrow('Failed to fetch voices: API Error');
    });
  });

  describe('textToSpeech', () => {
    beforeEach(() => {
      service = new ElevenLabsService(mockApiKey);
    });

    it('should convert text to speech successfully', async () => {
      const mockAudioData = new ArrayBuffer(1024);
      const options: TextToSpeechOptions = {
        text: 'Hello world',
        voice_id: 'voice1'
      };

      mockedAxios.post.mockResolvedValueOnce({
        data: mockAudioData,
        status: 200
      });

      const result = await service.textToSpeech(options);

      expect(result.success).toBe(true);
      expect(result.audioData).toBe(mockAudioData);
      expect(result.sampleRate).toBe(44100);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.elevenlabs.io/v1/text-to-speech/voice1/stream',
        expect.objectContaining({
          text: 'Hello world',
          model_id: 'eleven_turbo_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
          output_format: 'mp3_44100_128'
        }),
        expect.objectContaining({
          headers: {
            'xi-api-key': mockApiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg',
          },
          responseType: 'arraybuffer',
        })
      );
    });

    it('should handle different output formats and sample rates', async () => {
      const mockAudioData = new ArrayBuffer(1024);
      const options: TextToSpeechOptions = {
        text: 'Hello world',
        voice_id: 'voice1',
        output_format: 'pcm_22050'
      };

      mockedAxios.post.mockResolvedValueOnce({
        data: mockAudioData,
        status: 200
      });

      const result = await service.textToSpeech(options);

      expect(result.success).toBe(true);
      expect(result.sampleRate).toBe(22050);
    });

    it('should handle API errors during text-to-speech conversion', async () => {
      const options: TextToSpeechOptions = {
        text: 'Hello world',
        voice_id: 'voice1'
      };

      mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));

      const result = await service.textToSpeech(options);

      expect(result.success).toBe(false);
      expect(result.error).toBe('API Error');
    });
  });

  describe('getVoiceById', () => {
    beforeEach(() => {
      service = new ElevenLabsService(mockApiKey);
    });

    it('should fetch voice by ID successfully', async () => {
      const mockVoice: ElevenLabsVoice = {
        voice_id: 'voice1',
        name: 'Alice',
        category: 'generated'
      };

      mockedAxios.get.mockResolvedValueOnce({
        data: mockVoice,
        status: 200
      });

      const voice = await service.getVoiceById('voice1');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.elevenlabs.io/v1/voices/voice1',
        {
          headers: {
            'xi-api-key': mockApiKey,
          },
        }
      );
      expect(voice).toEqual(mockVoice);
    });

    it('should return null when voice is not found', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Voice not found'));

      const voice = await service.getVoiceById('nonexistent');

      expect(voice).toBeNull();
    });
  });

  describe('testConnection', () => {
    beforeEach(() => {
      service = new ElevenLabsService(mockApiKey);
    });

    it('should return true for successful connection', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { voices: [] },
        status: 200
      });

      const isConnected = await service.testConnection();

      expect(isConnected).toBe(true);
    });

    it('should return false for failed connection', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Connection failed'));

      const isConnected = await service.testConnection();

      expect(isConnected).toBe(false);
    });
  });

  describe('getUserInfo', () => {
    beforeEach(() => {
      service = new ElevenLabsService(mockApiKey);
    });

    it('should fetch user info successfully', async () => {
      const mockUserInfo = {
        subscription: { tier: 'starter' },
        usage: { characters_used: 100 }
      };

      mockedAxios.get.mockResolvedValueOnce({
        data: mockUserInfo,
        status: 200
      });

      const userInfo = await service.getUserInfo();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.elevenlabs.io/v1/user',
        {
          headers: {
            'xi-api-key': mockApiKey,
          },
        }
      );
      expect(userInfo).toEqual(mockUserInfo);
    });

    it('should handle API errors when fetching user info', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      await expect(service.getUserInfo()).rejects.toThrow('Failed to fetch user info: API Error');
    });
  });

  describe('createElevenLabsService', () => {
    it('should create service and test connection', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: { voices: [] },
        status: 200
      });

      const service = await createElevenLabsService(mockApiKey);

      expect(service).toBeInstanceOf(ElevenLabsService);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.elevenlabs.io/v1/voices',
        expect.objectContaining({
          headers: {
            'xi-api-key': mockApiKey,
          },
        })
      );
    });

    it('should throw error when connection fails', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Connection failed'));

      await expect(createElevenLabsService(mockApiKey)).rejects.toThrow(
        'Failed to connect to ElevenLabs API. Please check your API key.'
      );
    });
  });
});
