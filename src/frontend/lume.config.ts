// Lume Configuration - https://lume.land/docs/configuration/config-file/

import { Env } from "@/common/env.ts";

import lume from "lume/mod.ts";
import date from "lume/plugins/date.ts";
import feed from "lume/plugins/feed.ts";
import nunjucks from "lume/plugins/nunjucks.ts";
import robots from "lume/plugins/robots.ts";
import redirects from "lume/plugins/redirects.ts";
import sitemap from "lume/plugins/sitemap.ts";
import minifyHTML from "lume/plugins/minify_html.ts";
import readingInfo from "lume/plugins/reading_info.ts";

import codeHighlight from "lume/plugins/code_highlight.ts";
import langJavaScript from "highlight/lib/languages/javascript";
import langBash from "highlight/lib/languages/bash";
import langPhp from "highlight/lib/languages/php";
import langTypeScript from "highlight/lib/languages/typescript";

import { format } from "date-fns";

// Load Env Vars with suitable defaults

const env = new Env();

const buildDir: string = env.get("SITE_BUILD_DIR", "build");
const publicDir: string = env.get("SITE_PUBLIC_DIR", "public");
const siteUrl: string = env.getUrl();

// Build the site using Lume

const site = lume({
  src: `./${buildDir}`,
  dest: `./${publicDir}`,
  location: new URL(siteUrl),
  prettyUrls: true,
  emptyDest: true,
});

// Load environment variables

const siteFeedTitle: string = env.get("SITE_FEED_TITLE");
const siteFeedDesc: string = env.get("SITE_FEED_DESC");
const siteFeedDefaultTitle: string = env.get("SITE_FEED_DEFAULT_TITLE");
const siteLang: string = env.get("SITE_LANG", "en-GB");
const siteAuthor: string = env.get("SITE_AUTHOR");
const sitePosthogId: string = env.get("SITE_POSTHOG_ID");
const sitePosthogApiHost: string = env.get("SITE_POSTHOG_API_HOST");
const sitePosthogUiHost: string = env.get("SITE_POSTHOG_UI_HOST");
const siteIsLocal: boolean = env.isLocal();
const siteEnv: string = siteIsLocal ? "local" : env.get("SITE_ENV", "hosted");

// Get the build id or fallback to a timestamp

const dateNow: Date = new Date();
const siteBuildDate: string = format(dateNow, "yyyyMMddHHmmss");
const siteBuildId: string = env.get("SITE_BUILD_ID", siteBuildDate);

// Save env vars as site data variables so templates can use them

site.data("SITE_LOCAL", siteIsLocal);
site.data("SITE_ENV", siteEnv);
site.data("SITE_URL", siteUrl);
site.data("SITE_LANG", siteLang);
site.data("SITE_AUTHOR", siteAuthor);
site.data("SITE_FEED_TITLE", siteFeedTitle);
site.data("SITE_FEED_DESC", siteFeedDesc);
site.data("SITE_FEED_DEFAULT_TITLE", siteFeedDefaultTitle);
site.data("SITE_POSTHOG_ID", sitePosthogId);
site.data("SITE_POSTHOG_API_HOST", sitePosthogApiHost);
site.data("SITE_POSTHOG_UI_HOST", sitePosthogUiHost);
site.data("SITE_BUILD_ID", siteBuildId);

// Lume Plugins

site.use(nunjucks());
site.use(date());
site.use(redirects());

// --- Add styling for code blocks in page content

site.use(codeHighlight({
  languages: {
    javascript: langJavaScript,
    bash: langBash,
    php: langPhp,
    typescript: langTypeScript,
  },
}));

// --- Generate RSS and JSON feeds of recent posts

site.use(feed({
  output: ["/posts.rss", "/posts.json"],
  query: "Post",
  sort: "date=desc",
  limit: 100,
  info: {
    title: siteFeedTitle,
    description: siteFeedDesc,
    published: new Date(),
    self: "/posts.json",
    lang: siteLang,
    generator: false,
    authorName: siteAuthor,
    authorUrl: siteUrl,
  },
  items: {
    title: "=title",
    content: "$.post-content",
    image: "=cover",
    published: "=date",
    updated: undefined,
    lang: siteLang,
    authorName: siteAuthor,
    authorUrl: siteUrl,
  },
}));

// --- Generate a custom robots.txt

site.use(robots({
  "disallow": [
    "Mediapartners-Google",
    "Adsbot-Google",
    "Amazonbot",
    "anthropic-ai",
    "Applebot",
    "Bytespider",
    "CCBot",
    "ChatGPT",
    "Claude-Web",
    "ClaudeBot",
    "Diffbot",
    "FacebookBot",
    "Google-Extended",
    "GPTBot",
    "Image2dataset",
    "ImagesiftBot",
    "Omgili",
    "Omgilibot",
    "PerplexityBot",
    "YouBot",
    "PerplexityBot",
    "YouBot",
  ],
}));

// --- Minify generated HTML files

site.use(minifyHTML({
  // @ts-ignore: this is a valid option
  keep_closing_tags: true,
}));

// --- Generate sitemap.xml

site.use(sitemap());

// --- Allow page word count and reading minutes data

site.use(readingInfo());

export default site;
