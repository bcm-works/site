import { MarkdownContent } from "@/types/markdown.type.ts";

// Define the AppState interface which is used to shared config
// via 'ctx.state' to middlewares, layouts and routes.
export interface AppState {
  SITE_AUTHOR: string;
  SITE_TITLE: string;
  SITE_DESC: string;
  SITE_URL: string;
  SITE_ENV: string;
  SITE_LOCAL: boolean;
  SITE_LANG: string;
  SITE_TIMEZONE: string;
  SITE_BUILD_DATE?: string | number;
  SITE_POSTHOG_ID: string;
  SITE_POSTHOG_API_HOST: string;
  SITE_POSTHOG_UI_HOST: string;
  page: MarkdownContent | { attrs: Record<PropertyKey, never>, contentMarkdown: "", contentHtml: "" };
}
