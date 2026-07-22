---
name: infra-deployment
description: Railway infrastructure-as-code and Docker image build/run flow for the bcm.works site
triggers:
  files:
    - "infra/.railway/railway.ts"
    - "Dockerfile"
    - "src/docker-build.test.ts"
    - ".mise/tasks/docker/*"
  keywords:
    - railway
    - docker
    - deploy
    - dockerfile
    - healthcheck
    - infra
---

You are working on **deployment infrastructure**: the Railway service definition and the Docker image that serves the built static site.

## Domain purpose
Production runs the site as a Docker container on Railway. Infrastructure is declared as code in `infra/.railway/railway.ts` (service `bcm-site`), and the runtime image is defined by the multi-stage `Dockerfile`. Railway pulls the pre-published image `ghcr.io/bcm-works/site:latest` from GitHub Packages (GHCR) — it does **not** build from source. The release flow must build and push that image before an IaC apply takes effect.

## Business rules / invariants
- Railway serves the published image `ghcr.io/bcm-works/site:latest`, not a source build. Code changes only reach production after the image is rebuilt and pushed under that tag.
- Env vars in `railway.ts` use `preserve()` — their values are managed in the Railway dashboard and IaC must never overwrite them. Adding a new site config value means adding it here AND as a `Dockerfile` `ARG`+`ENV` AND to the `--build-arg` list in `.mise/tasks/docker/build`.
- `SITE_*` values are baked into the image at build time (static site). Changing site config requires a rebuild, not just a restart.
- Healthcheck path is `/health`; the server (`src/server.ts`) must keep serving it. `replicas: 1`, domains: bcm.works, murty.au, and their www variants.

## Non-obvious behaviors
- The release workflow (`.github/workflows/release.yml`) publishes to GHCR: `docker/metadata-action` images are prefixed `ghcr.io/${{ secrets.SITE_DOCKER_IMAGE_PATH }}`.
- The Dockerfile has two stages: `build` runs `deno task build`; `serve` copies only `public/`, `src/server.ts`, `src/site.class.ts`, and Deno config — keeps the image minimal. Don't expect other source files at runtime.
- Container runs as non-root user `deno`, exposes port 8000, and starts via `CMD ["deno", "task", "start"]`. `src/docker-build.test.ts` asserts exactly these (User, Cmd, port 8000/tcp).
- Local build tags both `bcm-site-local:latest` and `bcm-site-local:commit-<sha>`, targets `linux/amd64`, and sources `.env` for build args.

## Critical files (purpose, not inventory)
- `infra/.railway/railway.ts` — declares the Railway service, domains, healthcheck, resource limits, and preserved env keys.
- `Dockerfile` — multi-stage build→serve image; the ARG/ENV block is the contract for build-time site config.
- `src/docker-build.test.ts` — inspects `bcm-site-local:latest`; requires a prior `deno task docker-build` or it fails.

## Critical Rules
- Run `deno task docker-build` before `deno task test` (docker tests inspect the local image).
- Keep the `Dockerfile` ENV list, the mise `--build-arg` list, and `railway.ts` `env` keys in sync when adding config.
- Follow project hard rules: never run `git commit`/`push`/`rm`/`kill`; print `sudo` commands instead of running them.

---
**Last Updated:** 2026-07-17
