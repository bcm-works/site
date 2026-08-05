# Change Deployment Target, Remove Docker

## Status

**Accepted (5 Aug 2026)**

## Context

Build and deployment processes were slow and overly complicated.

## Decision(s)

- Moving deployment target from Railway to Deno Deploy
- Updating server code to use built in Deno server features
- Removing Docker features entirely

## Consequences

- Initial engineering work to update server code, related tasks, config and docs
- One-off manual cleanup of current Docker setup
- Adds minor lock-in to Deno Deploy
- Removes lock-in to Railway
