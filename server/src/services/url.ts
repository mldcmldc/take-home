import { nanoid } from "nanoid";
import {
  InvalidUrlFormat,
  ShortLinkHasExpired,
  ShortURLNotFound,
  SlugAlreadyExists,
} from "@app/util/errors";
import { UrlClickType, UrlType } from "@app/types/url";
import { createUrlRepository } from "@app/repositories/url";
import {
  cacheInvalidShortId,
  cacheUrl,
  extendCacheTTL,
  getCachedUrl,
  isInvalidShortIdCached,
} from "./cache";
import { db } from "@app/db/knex";

const urlRepo = createUrlRepository(db);

export async function createShortUrl(data: UrlType) {
  const {
    slug: customSlug,
    long_url,
    expires_at,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
  } = data;

  // Let this throw naturally if long_url is invalid
  try {
    new URL(long_url);
  } catch (err) {
    throw InvalidUrlFormat(long_url);
  }

  const randomSlug = nanoid(8);
  const slug = customSlug || randomSlug;

  const existing = await urlRepo.slugExists(slug);

  if (existing) {
    throw SlugAlreadyExists(slug);
  }

  const [id] = await urlRepo.createUrl({
    slug,
    long_url,
    expires_at,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term,
  });

  return { id, slug };
}

export async function logClick({
  slug,
  referer,
  user_agent,
  ip,
}: UrlClickType) {
  urlRepo
    .logClick({
      slug,
      referer,
      user_agent,
      ip,
    })
    .catch(console.error);
}

export async function getUrlClicks() {
  return await urlRepo.getUrlClicks();
}

export async function getShortUrl(slug: string) {
  const isInvalidCached = await isInvalidShortIdCached(slug);
  if (isInvalidCached) {
    throw ShortURLNotFound(slug);
  }

  let longUrl = await getCachedUrl(slug);

  if (longUrl) {
    await extendCacheTTL(slug); // refresh TTL on hit
    console.log("CACHED VALUE RETURNED");

    const urlObj = {
      long_url: longUrl,
      slug,
    };
    return urlObj;
  }

  const url = await urlRepo.findUrlBySlug(slug);

  if (!url) {
    cacheInvalidShortId(slug);
    throw ShortURLNotFound(slug);
  }

  // Check if expired
  if (url.expires_at && new Date(url.expires_at) < new Date()) {
    cacheInvalidShortId(slug);
    throw ShortLinkHasExpired(slug);
  }

  const ttl = url.expires_at
    ? Math.round((new Date(url.expires_at).getTime() - Date.now()) / 1000)
    : undefined;

  cacheUrl(url.slug, url.long_url, ttl);

  console.log("DB VALUE RETURNED");
  return url;
}
