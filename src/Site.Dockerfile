# Build stage
FROM denoland/deno:alpine AS build
WORKDIR /app

# Apply security updates and install required system packages.
RUN apk update && \
    apk add --no-cache --upgrade openssl busybox ssl_client && \
    apk add --no-cache libgcc libstdc++ curl bash

# Copy over config files and scripts.
COPY deno.json /app
COPY deno.lock /app
COPY src/common /app/src/common
COPY src/tasks /app/src/tasks

# Copy the rest of the repo directory,
# besides items filtered out by '.dockerignore'.
COPY . .

# Define build arguments, set via Docker Build parameters like:
#   --build-arg SITE_AUTHOR="Jane Doe"
#   --env-file ./.staging.sample.env
ARG SITE_URL
ARG SITE_ENV
ARG PORT
ARG SITE_PORT
ARG SITE_PUBLIC_DIR
ARG SITE_BUILD_DIR
ARG SITE_BUILD_ID
ARG SITE_AUTHOR
ARG SITE_TITLE
ARG SITE_DESC
ARG SITE_REPO
ARG SITE_LANG
ARG SITE_FEED_TITLE
ARG SITE_FEED_DESC
ARG SITE_FEED_DEFAULT_TITLE
ARG SITE_POSTHOG_ID
ARG SITE_POSTHOG_API_HOST
ARG SITE_POSTHOG_UI_HOST
ARG SITE_GITHUB_ID

# Persist build arguments as environment variables so
# resulting Docker Containers can access the values.
ENV SITE_URL=${SITE_URL}
ENV SITE_ENV=${SITE_ENV}
ENV PORT=${PORT}
ENV SITE_PORT=${SITE_PORT}
ENV SITE_PUBLIC_DIR=${SITE_PUBLIC_DIR}
ENV SITE_BUILD_DIR=${SITE_BUILD_DIR}
ENV SITE_BUILD_ID=${SITE_BUILD_ID}
ENV SITE_AUTHOR=${SITE_AUTHOR}
ENV SITE_TITLE=${SITE_TITLE}
ENV SITE_DESC=${SITE_DESC}
ENV SITE_REPO=${SITE_REPO}
ENV SITE_LANG=${SITE_LANG}
ENV SITE_FEED_TITLE=${SITE_FEED_TITLE}
ENV SITE_FEED_DESC=${SITE_FEED_DESC}
ENV SITE_FEED_DEFAULT_TITLE=${SITE_FEED_DEFAULT_TITLE}
ENV SITE_POSTHOG_ID=${SITE_POSTHOG_ID}
ENV SITE_POSTHOG_API_HOST=${SITE_POSTHOG_API_HOST}
ENV SITE_POSTHOG_UI_HOST=${SITE_POSTHOG_UI_HOST}
ENV SITE_GITHUB_ID=${SITE_GITHUB_ID}

# Install dependencies
RUN deno task install

# Build the site
RUN deno task build

# The 'serve' stage is the minimum required files and binaries to run the
# static files from the 'build' stage.
# This minimises the resulting final Docker Image size, speeding up build and push times.
FROM denoland/deno:alpine AS serve
WORKDIR /app

# Copy over some variables so the front-end can use them
ARG SITE_BUILD_ID
ARG SITE_URL
ARG SITE_ENV
ARG SITE_AUTHOR
ARG SITE_TITLE
ARG SITE_DESC
ARG SITE_REPO

# Apply security updates and install required system packages.
RUN apk update && \
    apk add --no-cache --upgrade openssl busybox ssl_client

# Only over the required files to serve the static site.
COPY --from=build --chown=deno:deno /app/src/backend /app/src/backend
COPY --from=build --chown=deno:deno /app/src/common /app/src/common
COPY --from=build --chown=deno:deno /app/public /app/public
COPY --from=build --chown=deno:deno /app/deno.json /app/deno.lock /app/

# Set Docker Image labels
# From: https://github.com/opencontainers/image-spec/blob/main/annotations.md
LABEL maintainer="Brendan Murty"
LABEL org.opencontainers.image.title="bcm-site"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.version=$SITE_BUILD_ID
LABEL org.opencontainers.image.authors=$SITE_AUTHOR
LABEL org.opencontainers.image.source=$SITE_REPO
LABEL org.opencontainers.image.url=$SITE_REPO
LABEL org.opencontainers.image.description=$SITE_DESC

# Start the static file server as the non-root user 'deno'.
USER deno
EXPOSE 8000
CMD ["deno", "task", "serve"]
