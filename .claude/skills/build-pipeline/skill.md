---
name: build-pipeline
description: Lume/Deno build orchestration, CSS bundling, and env/config loading for bcm.works
triggers:
  files:
    - src/lume.ts
    - src/site.class.ts
    - .config/mise/tasks/build
    - deno.jsonc
    - src/build.test.ts
  keywords:
    - build
    - lume
    - css
    - minify
    - env
    - site.data
    - mise
---

You are working on **the bcm.works build pipeline** — turning `content/` + `src/` into the static `public/` site.

## Domain purpose
`deno task build` runs `mise run build` (`.config/mise/tasks/build`), which assembles an ephemeral `build/` dir, runs Lume via `src/lume.ts`, bundles CSS, and copies static assets into `public/`. `src/site.class.ts` (`Site`) is the single source of env/config loading for both the build and the runtime server.

## Business rules / invariants
- CSS is concatenated in a **fixed order** in the `build` task: `reset.css`, `theme.css`, `search.css`, `site.css`, `print.css` → `build/bcm.css`, then minified with lightningcss to `public/css/bcm.min.css`. Adding a CSS file means editing this `cat` list — Lume does not discover it.
- Both `build/` and `public/` are wiped (`rm -rf`) and recreated every build; Lume also uses `emptyDest: true`. Never hand-edit or commit either dir.
- Env vars must be surfaced to templates via `site.data(...)` in `src/lume.ts` — reading `Deno.env` inside a template won't work. Add a new template variable in both places.
- `getUrl()` returns `http://localhost:<SITE_PORT>` only when `SITE_ENV == "local"`; otherwise `SITE_URL` (default `https://bcm.works`). This drives Lume's `location` and all canonical/feed URLs.
- The feed plugin writes `/posts.rss` and `/posts.json`; the build then copies `posts.json` → `public/brendan/posts.json`. Both paths are load-bearing.

## Non-obvious behaviors
- `SITE_BUILD_DATE` (a `yyyyMMddHHmmss` timestamp) is injected via `site.data()` for cache-busting asset URLs.
- `Site.envVar` treats empty string as unset (falls back to default); `envVarNumber` treats `0`/NaN as unset.
- `robots` plugin in `src/lume.ts` disallows AI/scraper crawlers — keep that list when editing.
- Code highlighting expects a separate stylesheet at `/css/code-highlight.min.css` for the `tomorrow-night-bright` theme.

## Critical files (purpose, not inventory)
- `.config/mise/tasks/build` — the real orchestrator (dir setup, content copy, Lume run, CSS bundle, asset copy). CLAUDE.md's `bin/site-build.sh` / `styles.min.css` description is stale — this task is authoritative.
- `src/lume.ts` — Lume config: plugins, `site.data()` wiring, feed/robots/sitemap/pagefind.
- `src/site.class.ts` — env loading (`.site.env` via dotenv), URL/port resolution, PostHog logging.

## Critical Rules
- `src/*.test.ts` (e.g. `build.test.ts`) assert files are non-empty in `public/`, so they **require a prior build** — run `deno task build` before `deno task test`.
- Never run `git commit`, `git push`, `rm`, or `kill` (project hard rule); the build task itself uses `rm -rf` internally — do not invoke it manually as a shortcut.
- Run `bash -n .config/mise/tasks/build` before proposing changes to that script.

---
**Last Updated:** 2026-07-13
