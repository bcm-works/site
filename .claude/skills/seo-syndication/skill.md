---
name: seo-syndication
description: Crawler/client feeds and page metadata — robots.txt, sitemap.xml, RSS/JSON feeds, redirects, and Open Graph/canonical tags
triggers:
  files:
    - src/lume.ts
    - src/templates/layouts/page.layout.njk
    - robots.txt
    - sitemap.xml
  keywords:
    - robots
    - sitemap
    - open graph
    - canonical
    - feed
    - redirects
    - crawler
    - pagefind
---

You are working on **how the site presents itself to crawlers, feed readers, and social/link previews**.

## Domain purpose
Everything a machine (not a human browser) consumes: `robots.txt`, `sitemap.xml`, RSS + JSON post feeds, URL redirects, Pagefind search index, and the `<head>` metadata (canonical, Open Graph, feed autodiscovery) that governs how links unfurl and how pages are indexed. All of it is wired declaratively through Lume plugins in `src/lume.ts` and the shared `<head>` in `page.layout.njk`.

## Business rules / invariants
- `robots.txt` is a **deny-list of AI/scraper user-agents** (anthropic-ai, ClaudeBot, GPTBot, CCBot, PerplexityBot, etc.). To block a new bot, add its user-agent string to the `disallow` array in the `robots()` call in `src/lume.ts` — nothing else generates `robots.txt`.
- Feeds output to `/posts.rss` and `/posts.json` only, query `"Post"`, sorted `date=desc`, capped at `limit: 100`. Feed item content pulls from the `$.post-content` selector — renamed/removed CSS class breaks feed bodies silently.
- Canonical and `og:url` are always `{{ SITE_URL }}{{ url }}` — never hardcode absolute URLs in content; they must derive from `SITE_URL` (from `.site.env`) so local/hosted builds stay correct.
- `og:image` falls back in order: `photo_thumb_url` → `photo_url` → the default profile PNG. All three are prefixed with `SITE_URL`.

## Non-obvious behaviors
- Asset `<link>`s are cache-busted with `?v={{ SITE_BUILD_DATE }}` (a `yyyyMMddHHmmss` stamp generated per build in `src/lume.ts`). New long-lived assets should follow this pattern.
- Pagefind indexes `[data-pagefind-body]` (the content wrapper) and skips `[data-pagefind-ignore]` (the sidebar) plus the `excludeSelectors` list in the `pagefind()` config. Adding indexable regions or new chrome may need those selector lists updated.
- Plugin order in `src/lume.ts` matters: `minify_html` and `sitemap` run last, after content generation.

## Critical files (purpose, not inventory)
- `src/lume.ts` — single source of truth for all syndication plugins (robots, feed, sitemap, redirects, pagefind) and the `site.data()` vars templates read.
- `src/templates/layouts/page.layout.njk` — the shared `<head>`: title/canonical/OG/feed-autodiscovery metadata and PostHog snippet.

## Critical Rules
- Never hand-edit generated `robots.txt`, `sitemap.xml`, `posts.rss`, or `posts.json` in `public/` — regenerate via the build; edit the plugin config instead.
- Any new SITE_* value a template needs must be registered with `site.data(...)` in `src/lume.ts` first.

---
**Last Updated:** 2026-07-13
