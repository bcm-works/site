# Docker image

This directory contains the production container build for the static site and
backend API. The image intentionally supports `linux/amd64` only.

## Build

From the repository root:

```bash
bash .prototypes/docker/docker-build.sh
```

The build helper reads site configuration from `.env`. If that file is absent,
it creates a temporary build secret from the current process environment. Site
metadata is needed at build time because Lume embeds it in the generated static
pages. The build secret is not stored in the resulting image.

`SITE_BUILD_DIR`, and `SITE_PUBLIC_DIR` can also be set in the
environment before running the helper.

## Run locally

```bash
bash .prototypes/docker/docker-start.sh
```

The helper starts `bcm-site:latest` and publishes it at
`http://localhost:${PORT:-${SITE_PORT:-8000}}`. Runtime API configuration is
read from `.env` or from the current process environment.

The service:

- binds to `PORT`, then `SITE_PORT`, then `8000`;
- serves its health endpoint at `/api/health/`;
- runs as the unprivileged `deno` user; and
- starts using only dependencies cached in the image.

Stop it with:

```bash
bash .prototypes/docker/docker-stop.sh
```

## Hosted environments

Build the image for `linux/amd64` and inject runtime secrets through the hosting
platform's environment-variable store. Set `PORT` when required by the host.
Configure readiness checks against `/api/health/`; the image also includes an
equivalent Docker health check.
