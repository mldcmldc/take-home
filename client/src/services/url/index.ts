export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function shortenUrl({
  longUrl,
  slug,
  expiresAt,
  utmSource,
  utmMedium,
  utmCampaign,
  utmContent,
  utmTerm,
}: {
  longUrl: string;
  slug?: string;
  expiresAt?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}) {
  const response = await fetch(`${BASE_URL}/shorten`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      slug,
      long_url: longUrl,
      expires_at: expiresAt,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      utm_term: utmTerm,
    }),
  });

  return response;
}

export async function getShortenedUrl(slug?: string) {
  const response = await fetch(`${BASE_URL}/slug/${slug}`);

  return response;
}

export async function getUrlClicks() {
  try {
    const response = await fetch(`${BASE_URL}/urlclicks`);

    if (!response.ok) throw new Error("Failed to fetch");

    return response.json();
  } catch (err) {
    throw new Error("Failed to fetch");
  }
}
