import redis from "../lib/redis-client";

const CACHE_TTL = 60 * 5; // 5 minutes

const getCachedUrl = async (shortId: string) => {
  return await redis.get(`short:${shortId}`);
};

const cacheUrl = async (
  shortId: string,
  originalUrl: string,
  ttl = CACHE_TTL,
) => {
  await redis.setEx(`short:${shortId}`, ttl, originalUrl);
};

const extendCacheTTL = async (shortId: string, ttl = CACHE_TTL) => {
  await redis.expire(`short:${shortId}`, ttl);
};

const cacheInvalidShortId = async (shortId: string) => {
  await redis.setEx(`404:${shortId}`, 60, "1"); // Cache invalids for 1 min
};

const isInvalidShortIdCached = async (shortId: string) => {
  return await redis.exists(`404:${shortId}`); // 0 = no, 1 = yes
};

export {
  getCachedUrl,
  cacheUrl,
  extendCacheTTL,
  cacheInvalidShortId,
  isInvalidShortIdCached,
};
