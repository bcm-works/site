---
name: analytics-error-tracking
description: PostHog analytics and anonymous backend 404 error tracking, gated on SITE_POSTHOG_ID
triggers:
  files:
    - src/site.class.ts
    - src/server.ts
    - src/templates/layouts/page.layout.njk
    - src/lume.ts
  keywords:
    - posthog
    - analytics
    - error tracking
    - 404
    - captureException
    - SITE_POSTHOG_ID
---

You are working on **PostHog analytics and anonymous backend error tracking**.

## Domain purpose
Two independent PostHog integrations: (1) a frontend JS snippet injected into every page for visitor analytics, and (2) server-side capture of unmatched-route (404) events so broken links and bad requests surface in PostHog. Both are anonymous — no PII is attached.

## Business rules / invariants
- **Both integrations are hard-gated on `SITE_POSTHOG_ID`.** If it's empty, `postHogAnonBackendEvent` returns immediately and the frontend `<script>` block is omitted (`{% if SITE_POSTHOG_ID %}` in `page.layout.njk`). No analytics runs without the ID — never assume PostHog is loaded.
- Backend events are sent as exceptions via `postHogClient.captureException(new Error(...))`, not plain captures. The distinct-id/actor is `${SITE_ENV}-backend-anon-event` (env-scoped) and the message is `"${statusCode} ${url}"`.
- Health-check paths (`/health/`, `/api/health/`, `/status/`, `/ping/`) return 200 and must **never** fire a 404 event.
- An unmatched route fires `postHogAnonBackendEvent(404, request)` then **301-redirects to `/`** — it does not serve a 404 page. Preserve both the event and the redirect together.

## Non-obvious behaviors
- The three PostHog env vars (`SITE_POSTHOG_ID`, `SITE_POSTHOG_API_HOST`, `SITE_POSTHOG_UI_HOST`) reach templates only because `lume.ts` re-exposes them via `site.data(...)`. Adding a new PostHog config value requires a matching `site.data()` line or templates won't see it.
- Frontend init uses `person_profiles: 'always'` and a pinned `defaults: '2026-05-30'` — keep these when editing the snippet.
- `logError` (used before sending a backend event) only prints when `SITE_ENV == "local"`; in hosted envs the send is silent by design.

## Critical files (purpose, not inventory)
- `src/site.class.ts` — `postHogAnonBackendEvent` builds the PostHog client and emits the anonymous exception; also owns env-var access.
- `src/server.ts` — decides when a request is a 404 and fires the backend event before redirecting.
- `src/templates/layouts/page.layout.njk` — the gated frontend PostHog snippet.
- `src/lume.ts` — bridges PostHog env vars into template data.

## Critical Rules
- Never remove the `SITE_POSTHOG_ID` guard on either integration — it's the on/off switch for all analytics.
- Keep backend events anonymous: no request bodies, cookies, or user identifiers in the event data.

---
**Last Updated:** 2026-07-13
