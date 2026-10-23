// Frontend Types

export interface SitePageData {
  title?: string;
  description?: string;
  theme?: string;
  body_class?: string;
  date?: Date;
  photo_thumb_url?: string;
  photo_url?: string;
  content?: unknown;
  SITE_LANG?: string;
  SITE_AUTHOR?: string;
  SITE_URL?: string;
  SITE_FEED_DESC?: string;
  SITE_FEED_TITLE?: string;
  SITE_BUILD_ID?: string;
  SITE_ENV?: string;
  SITE_POSTHOG_ID?: string;
  SITE_POSTHOG_API_HOST?: string;
  SITE_POSTHOG_UI_HOST?: string;
}

export type GithubUser = {
  username?: string;
  status?: string;
  repos?: number;
  prs?: number;
  starred?: number;
  following?: number;
  followers?: number;
};

export type PostData = {
  url: string;
  title: string;
  content?: string;
  date: Date;
  tags?: string[];
  readingInfo?: {
    words: number;
  };
};
