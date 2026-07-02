# Change Site Tech Stack

## Status

**Accepted (3 July 2026)**

## Context

Alter the initial Tech Stack from [choose-site-teck-stack](20260531_choose-site-teck-stack.md).

Simplify the infrastructure setup and use a managed service to allow for quicker creation of new systems.

Considered [PikaPods](https://www.pikapods.com/) and [Railway](https://railway.com/).

## Decision(s)

- PikaPods only allows hosting of their curated list of Docker images
- Going with Railway
- Create initial Railway services manually
- Add Infra as Code setup for Railway, importing the manual setup
- Update docs and lower detail level in infra related systems

## Consequences

- Locked in to systems: Railway
- One-off initial manual setup in Railway
- One-off manual infra removal from GCP
