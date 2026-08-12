// Lume Configuration - https://lume.land/docs/configuration/config-file/

import { Env as bcmEnv } from "@/backend/env.ts";
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

// Load environment variables

const bcm = new bcmEnv();
const siteUrl: string = bcm.getUrl();
const siteFeedTitle: string = bcm.get("SITE_FEED_TITLE");
const siteFeedDesc: string = bcm.get("SITE_FEED_DESC");
const siteFeedDefaultTitle: string = bcm.get("SITE_FEED_DEFAULT_TITLE");
const siteLang: string = bcm.get("SITE_LANG", "en-GB");
const siteAuthor: string = bcm.get("SITE_AUTHOR");
const sitePosthogId: string = bcm.get("SITE_POSTHOG_ID");
const sitePosthogApiHost: string = bcm.get("SITE_POSTHOG_API_HOST");
const sitePosthogUiHost: string = bcm.get("SITE_POSTHOG_UI_HOST");
const siteIsLocal: boolean = bcm.isLocal();
const siteEnv: string = siteIsLocal ? "local" : bcm.get("SITE_ENV", "hosted");
const siteBuildId: string = bcm.getBuildId();

// Build the site using Lume

const site = lume({
  prettyUrls: true,
  emptyDest: false,
  src: "./build",
  dest: "./public",
  location: new URL(siteUrl)
});

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
    typescript: langTypeScript
  }
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
    authorUrl: siteUrl
  },
  items: {
    title: "=title",
    content: "$.post-content",
    image: "=cover",
    published: "=date",
    updated: undefined,
    lang: siteLang,
    authorName: siteAuthor,
    authorUrl: siteUrl
  }
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
    "YouBot"
  ]
}));

// --- Minify generated HTML files

site.use(minifyHTML({
  // @ts-ignore: this is a valid option
  keep_closing_tags: true
}));

// --- Generate sitemap.xml

site.use(sitemap());

// --- Allow page word count and reading minutes data

site.use(readingInfo());

export default site;
