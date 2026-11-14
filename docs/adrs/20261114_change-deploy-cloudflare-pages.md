# Change Deployment Target to Cloudflare Workers

## Status

**Accepted (14 Nov 2026)**

## Context

Move to a more suitable static site infrastructure host.

## Decision(s)

- Move static hosting to a new Cloudflare Workers setup
- Keep GitHub Actions workflows, but alter final deployment logic
- Upload only the generated `public/` directory
- Add supporting setup docs and config

## Consequences

- Cloudflare Workers becomes the hosting provider for the site
- Adds a deployment dependency on Cloudflare Workers
- Initial manual setup is required

