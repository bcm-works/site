# syntax=docker/dockerfile:1

# This image intentionally supports linux/amd64 only.
FROM denoland/deno:ubuntu@sha256:47adfd2067d9fe7821b02d18efff7b56dae63dbb9cb948bad015a478d639d137 AS build
WORKDIR /app

ARG TARGETARCH
ARG SITE_BUILD_DIR=build
ARG SITE_CONFIG_HASH
ARG SITE_PUBLIC_DIR=public

ENV SITE_BUILD_DIR=${SITE_BUILD_DIR}
ENV SITE_PUBLIC_DIR=${SITE_PUBLIC_DIR}

RUN test "${TARGETARCH}" = "amd64" \
    || (echo "Unsupported architecture: ${TARGETARCH}; expected amd64" >&2 && exit 1)

# Copy the repository, excluding files matched by Site.Dockerfile.dockerignore.
COPY . .

# Site configuration is needed while Lume renders the static pages. The build
# helper supplies it as a secret so it is available only to this build step.
RUN --mount=type=secret,id=site,target=/app/.env \
    echo "Building site configuration ${SITE_CONFIG_HASH}" && \
    deno task build

# Resolve the complete server dependency graph while network access is
# available. Runtime uses --cached-only and therefore never contacts a package
# registry during startup.
RUN deno cache --frozen ./src/backend/server.ts

FROM denoland/deno:ubuntu@sha256:47adfd2067d9fe7821b02d18efff7b56dae63dbb9cb948bad015a478d639d137 AS output
WORKDIR /app

ARG SITE_PUBLIC_DIR=public

ENV SITE_PUBLIC_DIR=public

# OCI image annotations must be set in the final stage to appear on the image.
LABEL maintainer="Brendan Murty"
LABEL org.opencontainers.image.authors="Brendan Murty"
LABEL org.opencontainers.image.source="https://github.com/bcm-works/site"
LABEL org.opencontainers.image.url="https://github.com/bcm-works/site"
LABEL org.opencontainers.image.description="Website at bcm.works, related assets, tooling and documentation."
LABEL org.opencontainers.image.licenses="MIT"

COPY --from=build --chown=deno:deno /app/src/backend /app/src/backend
COPY --from=build --chown=deno:deno /app/${SITE_PUBLIC_DIR} /app/public
COPY --from=build --chown=deno:deno /app/deno.json /app/deno.json
COPY --from=build --chown=deno:deno /app/deno.lock /app/deno.lock
COPY --from=build --chown=deno:deno /deno-dir /deno-dir

USER deno

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --start-interval=1s --retries=3 \
  CMD deno eval \
  "const port = Deno.env.get('PORT') ?? Deno.env.get('SITE_PORT') ?? '8000'; const response = await fetch('http://127.0.0.1:' + port + '/api/health/'); if (!response.ok) Deno.exit(1);"

CMD ["sh", "-c", "exec deno serve --cached-only --frozen --host=0.0.0.0 --port=\"${PORT:-${SITE_PORT:-8000}}\" --allow-read=/app/public --allow-env --allow-net ./src/backend/server.ts"]
