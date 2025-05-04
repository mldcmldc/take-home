export type UrlType = {
  slug?: string;
  expires_at?: string;
  long_url: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
};

export type UrlClickType = {
  slug: string;
  ip?: string;
  user_agent?: string;
  referer?: string;
};
