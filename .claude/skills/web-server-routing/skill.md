---
name: web-server-routing
description: Custom Deno HTTP server that serves the built public/ dir with layered path resolution, health checks, and 404→homepage redirects
triggers:
  files:
    - src/server.ts
    - src/site.class.ts
  keywords:
    - server
    - routing
    - health check
    - 404
    - Deno.serve
    - static file
---

You are working on the **runtime HTTP server** that serves the already-built static site from `public/`. It is not Lume — Lume builds the files; this server delivers them at request time (used in the hosted/Docker deployment).

## Domain purpose
`src/server.ts` runs `Deno.serve` and resolves each request against the built `public/` tree. `src/site.class.ts` (`Site`) is the config/utility layer: env loading, URL/port resolution, file existence checks, PostHog error reporting, and colored logging.

## Business rules / invariants
- Every request path is normalized to end with `/` before resolution — this matches Lume building `index.html` inside each content directory. Keep this normalization; the three candidate paths below depend on it.
- Resolution order is fixed and must not be reordered: **static file** (`./public{path}`) → **page** (`./public{req}index.html`) → **post** (`./public/posts{req}index.html`) → 404. Posts are reachable both at `/posts/<slug>/` and bare `/<slug>/` because both fall through to the same post file; canonical URLs are set in the layout, not here.
- A miss is never a 404 body — it fires an anonymous PostHog event and **301-redirects to `/`**. Preserve the 301 (permanent) and the homepage target.
- Health checks (`/health/`, `/api/health/`, `/status/`, `/ping/`) return a bare `200 OK` and must short-circuit before file resolution.

## Non-obvious behaviors
- Port precedence: `PORT` env (platform-injected) wins over `SITE_PORT` (default 8000). `getUrl()` returns `localhost:<SITE_PORT|3000>` only when `SITE_ENV=local`, else `SITE_URL`.
- Logging is env-gated: `logDebug/Info/Success/Error` only print when `SITE_ENV=local`; only `logAlways` (purple) prints in hosted envs.
- PostHog reporting is a silent no-op when `SITE_POSTHOG_ID` is unset — safe to run without config.
- `fileExists` uses `Deno.lstatSync` and returns false on any error (including missing file), so it doubles as the routing branch guard.

## Critical Rules
- Do not add routes below the 404 redirect — it is terminal. Insert new match branches above it, respecting the static→page→post order.
- Read config through `Site` methods (`envVar`, `getPort`, `getUrl`, `isLocal`), never `Deno.env.get` directly, so defaults stay consistent.

---
**Last Updated:** 2026-07-13
