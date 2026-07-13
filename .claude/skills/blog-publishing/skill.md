---
name: blog-publishing
description: Markdown blog posts rendered via Nunjucks and syndicated as RSS + JSON feeds
triggers:
  files:
    - content/posts/*.md
    - src/templates/posts/*.njk
    - src/lume.ts
  keywords:
    - post
    - blog
    - feed
    - rss
    - posts.json
---

You are working on **blog publishing** — Markdown posts under `content/posts/` rendered through Nunjucks and syndicated as RSS + JSON feeds.

## Domain purpose
Each `.md` file in `content/posts/` becomes a published post page, listed on `/posts/` and syndicated to feed readers via `/posts.rss` and `/posts.json`. Readers and aggregators depend on the feeds staying valid and ordered newest-first.

## Business rules / invariants
- The `Post` tag is **mandatory** in every post's frontmatter `tags`. The feed plugin selects posts with `query: "Post"` (`src/lume.ts`) — omit the tag and the post never reaches RSS/JSON.
- Do **not** set `type` or `layout` per-post. `content/posts/_data.yml` applies `type: post` and `layout: posts/post.njk` to every file in the directory automatically.
- Feeds are capped at 100 items, sorted `date=desc`. On-site list (`post-list.njk`) uses `search.pages("type=post", "date=desc")`.
- Filenames follow `YYYYMMDD_slug.md`; each post sets an explicit `url: /posts/<slug>/` in frontmatter.

## Non-obvious behaviors
- Feed item content is pulled from the `.post-content` CSS selector (`content: "$.post-content"`), which `post.njk` wraps the body in — renaming that div drops all feed content.
- Feed item image comes from the `cover` frontmatter field (`image: "=cover"`).
- `post.njk` hides the `Post` tag from the visible tag list and links remaining tags to `/tags/<tag>/`.
- `post-list.njk` explicitly skips the `/posts/` index page so it doesn't list itself.
- Code fences only highlight `javascript`, `bash`, `php`, `typescript` (`codeHighlight` in `src/lume.ts`); other languages render unstyled.
- Pagefind search excludes `.post-date`, `.post-link`, `.posts-list`, `.tag-list` from its index.

## Critical files (purpose, not inventory)
- `content/posts/_data.yml` — assigns `type: post` + post layout to the whole folder.
- `src/lume.ts` — feed plugin config (query, selectors, outputs) and code highlighting.
- `src/templates/posts/post.njk` — single-post render; owns the `.post-content` wrapper the feed reads.

## Critical Rules
- New posts: use `deno task new-post` to scaffold correct frontmatter rather than hand-copying.
- Never drop the `Post` tag or rename `.post-content` — both silently break feeds.

---
**Last Updated:** 2026-07-13
