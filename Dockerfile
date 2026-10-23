# This image intentionally supports linux/amd64 only.
FROM denoland/deno:ubuntu AS build
WORKDIR /app

ARG TARGETARCH
ARG SITE_BUILD_DIR=build
ARG SITE_CONFIG_HASH
ARG SITE_PUBLIC_DIR=public

# Site configuration is needed while Lume renders the static pages, so it is
# embedded into the static output at build time. Hosting platforms pass these
# values as build arguments; the local build helper uses the same names.
ARG SITE_ENV=production
ARG SITE_URL
ARG SITE_AUTHOR
ARG SITE_TITLE
ARG SITE_DESC
ARG SITE_REPO
ARG SITE_LANG
ARG SITE_TIMEZONE
ARG SITE_FEED_TITLE
ARG SITE_FEED_DESC
ARG SITE_FEED_DEFAULT_TITLE
ARG SITE_POSTHOG_ID
ARG SITE_POSTHOG_API_HOST
ARG SITE_POSTHOG_UI_HOST

ENV SITE_BUILD_DIR=${SITE_BUILD_DIR}
ENV SITE_PUBLIC_DIR=${SITE_PUBLIC_DIR}

RUN test "${TARGETARCH}" = "amd64" \
    || (echo "Unsupported architecture: ${TARGETARCH}; expected amd64" >&2 && exit 1)

# Copy the repository, excluding files matched by .dockerignore.
COPY . .

RUN echo "Building site configuration ${SITE_CONFIG_HASH}" && \
    deno task build

# Resolve the complete server dependency graph while network access is
# available. Runtime uses --cached-only and therefore never contacts a package
# registry during startup.
RUN deno cache --frozen ./app/backend/server.ts

FROM denoland/deno:ubuntu AS output
WORKDIR /app

ARG SITE_PUBLIC_DIR=public

ENV SITE_PUBLIC_DIR=public

# Set Docker Image labels in the final stage so they are applied properly.
LABEL maintainer="Brendan Murty"
LABEL org.opencontainers.image.authors="Brendan Murty"
LABEL org.opencontainers.image.source="https://github.com/bcm-works/site"
LABEL org.opencontainers.image.url="https://github.com/bcm-works/site"
LABEL org.opencontainers.image.description="Website at bcm.works, related assets, tooling and documentation."
LABEL org.opencontainers.image.licenses="MIT"

COPY --from=build --chown=deno:deno /app/app/backend /app/app/backend
COPY --from=build --chown=deno:deno /app/tools /app/tools
COPY --from=build --chown=deno:deno /app/${SITE_PUBLIC_DIR} /app/public
COPY --from=build --chown=deno:deno /app/deno.json /app/deno.json
COPY --from=build --chown=deno:deno /app/deno.lock /app/deno.lock
COPY --from=build --chown=deno:deno /deno-dir /deno-dir

USER deno

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --start-interval=1s --retries=3 \
  CMD deno eval \
  "const port = Deno.env.get('PORT') ?? Deno.env.get('SITE_PORT') ?? '8000'; const response = await fetch('http://127.0.0.1:' + port + '/api/health/', { method: "HEAD" }); if (!response.ok) Deno.exit(1);"

CMD ["sh", "-c", "exec deno task serve"]
