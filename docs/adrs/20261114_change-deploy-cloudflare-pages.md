# Change Deployment Target to Cloudflare Pages

## Status

**Accepted (14 Nov 2026)**

## Context

Move to a more suitable static site infrastructure host.

## Decision(s)

- Move static hosting to a new Cloudflare Pages setup
- Keep GitHub Actions workflows, but alter final deployment logic
- Upload only the generated `public/` directory
- Add supporting setup docs and config

## Consequences

- Cloudflare Pages becomes the hosting provider for the site
- Initial manual setup is required
- Adds a deployment dependency on Cloudflare Pages and Wrangler

