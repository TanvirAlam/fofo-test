import winston from 'winston';

// Mock winston before importing logger
const mockLogger = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  http: jest.fn(),
  debug: jest.fn(),
};

jest.mock('winston', () => ({
  createLogger: jest.fn(() => mockLogger),
  format: {
    combine: jest.fn(),
    timestamp: jest.fn(),
    colorize: jest.fn(),
    printf: jest.fn(),
  },
  transports: {
    Console: jest.fn(),
    File: jest.fn(),
  },
  addColors: jest.fn(),
}));

describe('Logger Utils', () => {
  let logger: any;
  let morganStream: any;

  beforeAll(async () => {
    // Import logger after mocking winston
    const loggerModule = await import('../../../utils/logger');
    logger = loggerModule.logger;
    morganStream = loggerModule.morganStream;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logger', () => {
    it('should have all required logging methods', () => {
      expect(logger).toHaveProperty('error');
      expect(logger).toHaveProperty('warn');
      expect(logger).toHaveProperty('info');
      expect(logger).toHaveProperty('http');
      expect(logger).toHaveProperty('debug');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.http).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });

    it('should log error messages', () => {
      const message = 'Test error message';
      logger.error(message);
      expect(mockLogger.error).toHaveBeenCalledWith(message);
    });

    it('should log warning messages', () => {
      const message = 'Test warning message';
      logger.warn(message);
      expect(mockLogger.warn).toHaveBeenCalledWith(message);
    });

    it('should log info messages', () => {
      const message = 'Test info message';
      logger.info(message);
      expect(mockLogger.info).toHaveBeenCalledWith(message);
    });

    it('should log http messages', () => {
      const message = 'Test http message';
      logger.http(message);
      expect(mockLogger.http).toHaveBeenCalledWith(message);
    });

    it('should log debug messages', () => {
      const message = 'Test debug message';
      logger.debug(message);
      expect(mockLogger.debug).toHaveBeenCalledWith(message);
    });
  });

  describe('morganStream', () => {
    it('should have a write method', () => {
      expect(morganStream).toHaveProperty('write');
      expect(typeof morganStream.write).toBe('function');
    });

    it('should log messages through logger.http when write is called', () => {
      const message = 'HTTP request message\n';
      morganStream.write(message);
      expect(mockLogger.http).toHaveBeenCalledWith(message.trim());
    });

    it('should trim whitespace from messages', () => {
      const message = '  HTTP request with spaces  \n';
      morganStream.write(message);
      expect(mockLogger.http).toHaveBeenCalledWith('HTTP request with spaces');
    });

    it('should handle empty messages', () => {
      morganStream.write('');
      expect(mockLogger.http).toHaveBeenCalledWith('');
    });
  });
});
