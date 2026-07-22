---
name: base
description: Core conventions, tech stack, and project structure for bcm.works (Lume/Deno static site)
triggers:
  alwaysActivate: true
---

You are working in **site** — the [bcm.works](https://bcm.works) personal website: a Lume static site generator (v3.2.6) on Deno, plus a thin custom Deno HTTP server. Not MVC — it's a **content pipeline + static file server**.

## Tech Stack
Deno + TypeScript | Lume 3.2.6 (Nunjucks templates) | Docker | Mise (task runner) | Railway (hosting). No root `_config.ts` — Lume config is `src/lume.ts`, passed via `--config=src/lume.ts`.

## Commands
- `deno task build` — full build (→ `mise run build` → `.mise/tasks/build`)
- `deno task start` — serve `public/` via `src/server.ts`
- `deno task test` — `deno test --allow-run=deno,docker --allow-env --allow-read --allow-net src` (run a build first, some tests assert files exist in `public/`)
  - Single: `deno test --allow-run=deno,docker --allow-env --allow-read --allow-net src/site.class.test.ts`
- `deno task clean` — lint + format (→ `mise run clean-frontend`); `deno task lume <args>` — Lume directly
- `deno task new-post` — scaffold a post; `deno task install` / `update` — deps
- `deno task docker-build` / `docker-start` / `docker-stop`

## Critical Conventions
- **Never run `git commit`, `git push`, `rm`, or `kill`** — forbidden by project config. If `sudo` is needed, print the command and explain; do not invoke it.
- **`build/` and `public/` are generated — never hand-edit or commit them.** `build/` is wiped (`rm -rf`) every build; `public/` is Lume output.
- **Adding a CSS file requires updating the concatenation order** in `.mise/tasks/build` (fixed order: `reset.css`, `theme.css`, `search.css`, `site.css`, `print.css` → `bcm.css` → minified via lightningcss to `public/css/bcm.min.css`). CSS files live in `src/styles/`.
- **Run `bash -n <script>`** before proposing any shell script change.
- **Import alias `@/` → `./src/`** (`deno.jsonc`). Lume/highlight deps are pinned remote URLs in `deno.jsonc` imports.
- **Go through the `Site` class** (`src/site.class.ts`) for env access, URL/port resolution, logging, and PostHog — don't scatter `Deno.env.get` calls.
- Env vars load from `.env` via `@std/dotenv` (per-env templates: `.env.local`, `.env.github`, `.env.railway`), falling back to session env. Values reach templates through `site.data(...)` in `src/lume.ts`.
- Build runs under `TZ="$SITE_TIMEZONE"` — dates in output depend on it.
- Minimal, "why"-only comments. 2-space indent, line width 100, semicolons required, no tabs.
- **The CLAUDE.md/AGENTS.md prose about `bin/build.sh` and a `tools-reset.css`/`media-screen-*` CSS order is STALE.** There is no `bin/` dir. Verify against `.mise/tasks/build` before acting.
- `prototypes/` (deno-fresh and eleventy experiments) are **not** the site — ignore for site work despite ranking high in the import graph.

## Structure
- `content/` — Markdown pages/posts/tags with YAML frontmatter (source of truth for content)
- `src/` — TypeScript: `lume.ts` (Lume config/plugins), `site.class.ts` (`Site` utility), `server.ts` (static server with fallback routing + health checks + 404→`/` 301 redirect), `templates/` (Nunjucks `_includes`), `styles/` (layered CSS), `*.test.ts` (co-located Deno tests)
- `.mise/tasks/` — the real build/dev task scripts (bash)
- `infra/` — Railway infra-as-code + Docker image flow
- `assets/`, `docs/`, `design/` — static files, docs, design refs

---
**Last Updated:** 2026-07-17
