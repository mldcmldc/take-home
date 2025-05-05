// check if url is valid but does not have http:// or https://
export function normalizeURL(url: string) {
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  return new URL(url);
}

export function getUtmParams(url: string) {
  const parsedUrl = normalizeURL(url);
  const params = new URLSearchParams(parsedUrl.search);

  const utmSource = params.get("utm_source") ?? undefined;
  const utmMedium = params.get("utm_medium") ?? undefined;
  const utmCampaign = params.get("utm_campaign") ?? undefined;
  const utmContent = params.get("utm_content") ?? undefined;
  const utmTerm = params.get("utm_term") ?? undefined;

  return {
    url: parsedUrl.href,
    utmSource,
    utmMedium,
    utmCampaign,
    utmContent,
    utmTerm,
  };
}
