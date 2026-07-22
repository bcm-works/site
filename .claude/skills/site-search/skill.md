```markdown
---
name: site-search
description: Client-side full-text search via the Pagefind Lume plugin
triggers:
  files:
    - src/lume.ts
    - src/templates/search.njk
    - content/search.md
    - src/styles/search.css
  keywords:
    - search
    - pagefind
    - index
    - excerpt
    - full-text
---

You are working on **client-side full-text search** for bcm.works.

## Domain purpose
Visitors search the static site entirely in-browser. Pagefind builds a search index at build time from the generated HTML, and its UI widget mounts on the `/search` page. No server or external search service is involved.

## Business rules / invariants
- The UI mounts into the element with `id="search"`. The `containerId: "search"` in the Pagefind config in `src/lume.ts` MUST match the `<div id="search">` in `src/templates/search.njk`. Changing one without the other breaks the widget silently.
- `#search` is itself in `excludeSelectors` — the search page must not index its own UI, or results reference the search page.
- Indexing uses `rootSelector: "html"`, so anything not in `excludeSelectors` becomes searchable. When adding new chrome/navigation classes, add them to `excludeSelectors` in `src/lume.ts` to keep them out of results.

## Non-obvious behaviors
- `excerptLength: 0` and `showSubResults: false` are intentional: results show titles only, no body snippet. Don't "fix" this expecting excerpts.
- `resetStyles: true` strips Pagefind's default CSS; all styling comes from `src/styles/search.css` via the `--pagefind-ui-*` custom properties, which pull from the site's own theme variables (`--colour-highlight`, `--colour-foreground`, etc.). New Pagefind UI styling should reuse those theme vars, not hard-coded colours.
- Excluded selectors currently drop icons, header, print header, tag list, and post-list metadata so they don't pollute the index.

## Critical files (purpose, not inventory)
- `src/lume.ts` — registers `pagefind(...)` with the tuned `ui` and `indexing` options; the single source of search behaviour.
- `src/templates/search.njk` — layout providing the `#search` mount point.
- `content/search.md` — the `/search` page that uses the search layout.
- `src/styles/search.css` — themes the Pagefind widget via CSS custom properties.

## Critical Rules
- Keep `containerId`, the template `#search` div, and the `#search` exclude selector in sync.
- Search is build-time indexed — changes only take effect after `deno task build`.

---
**Last Updated:** 2026-07-13
```
