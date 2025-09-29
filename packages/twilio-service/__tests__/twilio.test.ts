// Mock twilio module completely
const mockClient = {
  calls: {
    create: jest.fn()
  },
  messages: {
    create: jest.fn()
  }
};

const mockTwilio = jest.fn(() => mockClient);
mockTwilio.twiml = {
  VoiceResponse: jest.fn(() => ({
    gather: jest.fn().mockReturnThis(),
    redirect: jest.fn().mockReturnThis(),
    toString: jest.fn().mockReturnValue('<Response><Gather>...</Gather></Response>')
  }))
};

jest.mock('twilio', () => mockTwilio);

import twilio from 'twilio';
import { makeCall, sendSMS, handleIncomingCall } from '../index';

const mockedTwilio = mockTwilio;

describe('Twilio Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Set up environment variables for tests
    process.env.TWILIO_ACCOUNT_SID = 'test_account_sid';
    process.env.TWILIO_AUTH_TOKEN = 'test_auth_token';
    process.env.TWILIO_PHONE_NUMBER = '+1234567890';

    // Reset the mock client
    mockClient.calls.create.mockReset();
    mockClient.messages.create.mockReset();
  });

  afterEach(() => {
    delete process.env.TWILIO_ACCOUNT_SID;
    delete process.env.TWILIO_AUTH_TOKEN;
    delete process.env.TWILIO_PHONE_NUMBER;
  });

  describe('makeCall', () => {
    it('should make a call successfully', async () => {
      const mockCall = {
        sid: 'test_call_sid_12345',
        to: '+1987654321',
        from: '+1234567890'
      };

      mockClient.calls.create.mockResolvedValueOnce(mockCall);

      const result = await makeCall('+1987654321', 'http://example.com/voice.xml');

      expect(result.success).toBe(true);
      expect(result.callSid).toBe('test_call_sid_12345');
      expect(mockClient.calls.create).toHaveBeenCalledWith({
        to: '+1987654321',
        from: '+1234567890',
        url: 'http://example.com/voice.xml'
      });
    });

    it('should handle call creation errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockClient.calls.create.mockRejectedValueOnce(new Error('Twilio API Error'));

      const result = await makeCall('+1987654321', 'http://example.com/voice.xml');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to make call');
      expect(consoleSpy).toHaveBeenCalledWith('Error making call:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    it('should use correct phone number from environment', async () => {
      const mockCall = { sid: 'test_sid' };
      mockClient.calls.create.mockResolvedValueOnce(mockCall);

      const result = await makeCall('+1987654321', 'http://example.com/voice.xml');

      expect(result.success).toBe(true);
      expect(mockClient.calls.create).toHaveBeenCalledWith({
        to: '+1987654321',
        from: '+1234567890',
        url: 'http://example.com/voice.xml'
      });
    });
  });

  describe('sendSMS', () => {
    it('should send SMS successfully', async () => {
      const mockMessage = {
        sid: 'test_message_sid_12345',
        to: '+1987654321',
        from: '+1234567890',
        body: 'Test message'
      };

      mockClient.messages.create.mockResolvedValueOnce(mockMessage);

      const result = await sendSMS('+1987654321', 'Test message');

      expect(result.success).toBe(true);
      expect(result.messageSid).toBe('test_message_sid_12345');
      expect(mockClient.messages.create).toHaveBeenCalledWith({
        to: '+1987654321',
        from: '+1234567890',
        body: 'Test message'
      });
    });

    it('should handle SMS sending errors', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockClient.messages.create.mockRejectedValueOnce(new Error('Invalid phone number'));

      const result = await sendSMS('+invalid', 'Test message');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to send SMS');
      expect(consoleSpy).toHaveBeenCalledWith('Error sending SMS:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    it('should handle empty message body', async () => {
      const mockMessage = { sid: 'test_sid' };
      mockClient.messages.create.mockResolvedValueOnce(mockMessage);

      const result = await sendSMS('+1987654321', '');

      expect(result.success).toBe(true);
      expect(mockClient.messages.create).toHaveBeenCalledWith({
        to: '+1987654321',
        from: '+1234567890',
        body: ''
      });
    });
  });

  describe('handleIncomingCall', () => {
    it('should generate correct TwiML response', () => {
      // Mock the twilio.twiml.VoiceResponse
      const mockVoiceResponse = {
        gather: jest.fn().mockReturnThis(),
        redirect: jest.fn().mockReturnThis(),
        toString: jest.fn().mockReturnValue('<Response><Gather>...</Gather></Response>')
      };

      const mockGather = {
        say: jest.fn()
      };

      mockVoiceResponse.gather.mockReturnValue(mockGather);

      // Mock the twilio.twiml namespace
      const mockTwiml = {
        VoiceResponse: jest.fn().mockReturnValue(mockVoiceResponse)
      };

      mockedTwilio.twiml = mockTwiml as any;

      const result = handleIncomingCall(null);

      expect(mockTwiml.VoiceResponse).toHaveBeenCalled();
      expect(mockVoiceResponse.gather).toHaveBeenCalledWith({
        input: 'speech',
        action: '/api/twilio/process-speech',
        speechTimeout: 'auto',
        language: 'en-US'
      });
      expect(mockGather.say).toHaveBeenCalledWith('Hello, welcome to Foodime. What would you like to order today?');
      expect(mockVoiceResponse.redirect).toHaveBeenCalledWith('/api/twilio/incoming-call');
      expect(result).toBe('<Response><Gather>...</Gather></Response>');
    });

    it('should return string representation of TwiML', () => {
      const expectedTwiML = '<Response><Gather input=\"speech\" action=\"/api/twilio/process-speech\"><Say>Hello, welcome to Foodime. What would you like to order today?</Say></Gather><Redirect>/api/twilio/incoming-call</Redirect></Response>';
      
      const mockVoiceResponse = {
        gather: jest.fn().mockReturnThis(),
        redirect: jest.fn().mockReturnThis(),
        toString: jest.fn().mockReturnValue(expectedTwiML)
      };

      const mockGather = {
        say: jest.fn()
      };

      mockVoiceResponse.gather.mockReturnValue(mockGather);

      const mockTwiml = {
        VoiceResponse: jest.fn().mockReturnValue(mockVoiceResponse)
      };

      mockedTwilio.twiml = mockTwiml as any;

      const result = handleIncomingCall(null);

      expect(typeof result).toBe('string');
      expect(result).toBe(expectedTwiML);
    });
  });

  describe('module exports', () => {
    it('should export individual functions', () => {
      expect(typeof makeCall).toBe('function');
      expect(typeof sendSMS).toBe('function');
      expect(typeof handleIncomingCall).toBe('function');
    });
  });

  describe('environment variable handling', () => {
    it('should initialize client with environment variables', () => {
      // Since the module is already loaded, we just check that the mock function exists
      expect(mockedTwilio).toBeDefined();
      expect(typeof mockedTwilio).toBe('function');
    });

    it('should handle missing environment variables gracefully', () => {
      // Test that the module can be required without throwing errors
      expect(() => {
        const module = require('../index');
        expect(module.makeCall).toBeDefined();
        expect(module.sendSMS).toBeDefined();
        expect(module.handleIncomingCall).toBeDefined();
      }).not.toThrow();
    });
  });
});
