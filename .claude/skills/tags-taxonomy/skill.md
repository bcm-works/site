---
name: tags-taxonomy
description: Tag pages and tag listings that group and filter blog posts by subject
triggers:
  files:
    - src/templates/posts/tag*.njk
    - content/tags.md
    - content/tags/*.md
  keywords:
    - tag
    - tags
    - taxonomy
    - tag-list
---

You are working on **the tag taxonomy** — pages that group and filter blog posts by subject (Family, Travel, CSS, UpcomingTasks, etc.).

## Domain purpose
`/tags/` shows every tag used across posts; `/tags/{Tag}/` shows the posts carrying that tag. Tags come from each post's frontmatter `tags:` list; the taxonomy pages surface them for browsing.

## Business rules / invariants
- A tag page only renders if a matching `content/tags/{Tag}.md` file exists. `tag-list.njk` links every discovered tag to `/tags/{tag}/`, so a tag without its own `.md` file produces a **dead link** — adding a new tag to a post requires adding the tag page file too.
- `content/tags/_data.yml` sets `type: tag` and `layout: posts/tag.njk` for **all** files in `content/tags/`. Individual tag files carry only `title:` — never add layout to them.
- Tag names are used verbatim as Lume `search.pages()` query tokens (`tag.njk:8`), as URL path segments, and as display text. They must be single words matching post frontmatter exactly (case-sensitive) — spaces break the search query.

## Non-obvious behaviors
- `tag-list.njk` builds the tag set by iterating all `type=post` pages and deduping, then sorting; it explicitly **excludes the `Post` tag** so the type marker never appears as a browsable subject.
- `tag.njk` derives the current tag from the URL (`url | replace("/tags/", "")`), not from frontmatter, then excludes the `/posts/` index page from results.

## Critical files (purpose, not inventory)
- `src/templates/posts/tag-list.njk` — collects/dedupes/sorts all post tags for the `/tags/` index; included by `tags.njk`.
- `src/templates/posts/tag.njk` — layout for a single tag page; queries posts by the URL-derived tag.
- `content/tags/_data.yml` — applies `type: tag` + layout to every tag page.

## Critical Rules
- When introducing a new tag on a post, create `content/tags/{Tag}.md` (frontmatter `title: Tag - {Tag}` only) or the `/tags/` link 404s.
- Keep tag names single-word and case-consistent with post frontmatter.

---
**Last Updated:** 2026-07-13
