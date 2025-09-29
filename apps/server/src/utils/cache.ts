import RedisService from "../services/RedisService";

export async function getCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl = 60
): Promise<T> {
  const redis = RedisService.getClient();
  if (!redis) {
    return fetchFn();
  }

  try {
    const cached = await redis.get(key);
    if (cached) {
      try {
        return JSON.parse(cached) as T;
      } catch {
        await redis.del(key);
      }
    }
  } catch (err) {}

  const data = await fetchFn();
  try {
    await redis.set(key, JSON.stringify(data), "EX", ttl);
  } catch (err) {
    console.warn(`Failed to cache key ${key}`, err);
  }

  return data;
}

export async function deleteCache(pattern: string) {
  const redis = RedisService.getClient();
  if (redis) {
    const keys = await redis.keys(pattern);
    if (keys.length) await redis.del(...keys);
  }
}
