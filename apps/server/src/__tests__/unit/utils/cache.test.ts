import { getCachedData, deleteCache } from '../../../utils/cache';

// Mock RedisService
const mockRedisClient = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  keys: jest.fn(),
};

jest.mock('../../../services/RedisService', () => ({
  __esModule: true,
  default: {
    getClient: jest.fn(() => mockRedisClient),
  },
}));

// Mock console.warn to avoid noise in tests
const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

describe('Cache Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockClear();
  });

  describe('getCachedData', () => {
    const testKey = 'test-key';
    const testData = { id: 1, name: 'Test Data' };
    const fetchFunction = jest.fn().mockResolvedValue(testData);

    it('should return cached data when available', async () => {
      mockRedisClient.get.mockResolvedValue(JSON.stringify(testData));

      const result = await getCachedData(testKey, fetchFunction);

      expect(result).toEqual(testData);
      expect(mockRedisClient.get).toHaveBeenCalledWith(testKey);
      expect(fetchFunction).not.toHaveBeenCalled();
      expect(mockRedisClient.set).not.toHaveBeenCalled();
    });

    it('should fetch and cache data when not cached', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      mockRedisClient.set.mockResolvedValue('OK');

      const result = await getCachedData(testKey, fetchFunction, 120);

      expect(result).toEqual(testData);
      expect(mockRedisClient.get).toHaveBeenCalledWith(testKey);
      expect(fetchFunction).toHaveBeenCalled();
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        testKey,
        JSON.stringify(testData),
        'EX',
        120
      );
    });

    it('should use default TTL when not specified', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      mockRedisClient.set.mockResolvedValue('OK');

      await getCachedData(testKey, fetchFunction);

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        testKey,
        JSON.stringify(testData),
        'EX',
        60 // Default TTL
      );
    });

    it('should delete corrupted cache and fetch fresh data', async () => {
      mockRedisClient.get.mockResolvedValue('invalid-json');
      mockRedisClient.del.mockResolvedValue(1);
      mockRedisClient.set.mockResolvedValue('OK');

      const result = await getCachedData(testKey, fetchFunction);

      expect(result).toEqual(testData);
      expect(mockRedisClient.del).toHaveBeenCalledWith(testKey);
      expect(fetchFunction).toHaveBeenCalled();
      expect(mockRedisClient.set).toHaveBeenCalled();
    });

    it('should handle Redis get errors gracefully', async () => {
      mockRedisClient.get.mockRejectedValue(
        new Error('Redis connection failed')
      );
      mockRedisClient.set.mockResolvedValue('OK');

      const result = await getCachedData(testKey, fetchFunction);

      expect(result).toEqual(testData);
      expect(fetchFunction).toHaveBeenCalled();
      expect(mockRedisClient.set).toHaveBeenCalled();
    });

    it('should handle Redis set errors gracefully and warn', async () => {
      mockRedisClient.get.mockResolvedValue(null);
      mockRedisClient.set.mockRejectedValue(new Error('Redis set failed'));

      const result = await getCachedData(testKey, fetchFunction);

      expect(result).toEqual(testData);
      expect(fetchFunction).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        `Failed to cache key ${testKey}`,
        expect.any(Error)
      );
    });

    it('should fetch data directly when Redis client is not available', async () => {
      const RedisService = require('../../../services/RedisService').default;
      RedisService.getClient.mockReturnValueOnce(null);

      const result = await getCachedData(testKey, fetchFunction);

      expect(result).toEqual(testData);
      expect(fetchFunction).toHaveBeenCalled();
      expect(mockRedisClient.get).not.toHaveBeenCalled();
      expect(mockRedisClient.set).not.toHaveBeenCalled();
    });
  });

  describe('deleteCache', () => {
    it('should delete cache keys matching pattern', async () => {
      const pattern = 'user:*';
      const keys = ['user:1', 'user:2', 'user:3'];

      mockRedisClient.keys.mockResolvedValue(keys);
      mockRedisClient.del.mockResolvedValue(3);

      await deleteCache(pattern);

      expect(mockRedisClient.keys).toHaveBeenCalledWith(pattern);
      expect(mockRedisClient.del).toHaveBeenCalledWith(...keys);
    });

    it('should do nothing when no keys match pattern', async () => {
      const pattern = 'nonexistent:*';

      mockRedisClient.keys.mockResolvedValue([]);

      await deleteCache(pattern);

      expect(mockRedisClient.keys).toHaveBeenCalledWith(pattern);
      expect(mockRedisClient.del).not.toHaveBeenCalled();
    });

    it('should do nothing when Redis client is not available', async () => {
      const RedisService = require('../../../services/RedisService').default;
      RedisService.getClient.mockReturnValueOnce(null);

      await deleteCache('pattern');

      expect(mockRedisClient.keys).not.toHaveBeenCalled();
      expect(mockRedisClient.del).not.toHaveBeenCalled();
    });

    it('should handle Redis errors gracefully', async () => {
      const pattern = 'error:*';

      mockRedisClient.keys.mockRejectedValue(new Error('Redis error'));

      // The function doesn't explicitly handle errors, so we expect it to throw
      await expect(deleteCache(pattern)).rejects.toThrow('Redis error');
    });
  });
});
