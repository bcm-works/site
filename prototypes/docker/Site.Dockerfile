FROM denoland/deno:ubuntu AS build
WORKDIR /app

# Set Docker Image properties
# From: https://github.com/opencontainers/image-spec/blob/main/annotations.md
LABEL maintainer="Brendan Murty"
LABEL org.opencontainers.image.authors="Brendan Murty"
LABEL org.opencontainers.image.source="https://github.com/bcm-works/site"
LABEL org.opencontainers.image.url="https://github.com/bcm-works/site"
LABEL org.opencontainers.image.description="Website at bcm.works, related assets, tooling and documentation."
LABEL org.opencontainers.image.licenses=MIT

# Apply security updates and install required packages.
RUN apt-get update && apt-get upgrade -y && apt-get install -y --no-install-recommends \
    bash git ca-certificates curl

# Download and setup Go
ARG GO_VERSION=1.26.6
RUN curl -fsSL "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz" \
    | tar -C /usr/local -xzf -
ENV PATH="/usr/local/go/bin:${PATH}"

# Define build arguments
ARG SITE_PORT
ARG SITE_BUILD_ID
ARG SITE_BUILD_DIR
ARG SITE_PUBLIC_DIR

# Persist build arguments as environment variables so
# resulting Docker Containers can access the values.
ENV SITE_BUILD_ID=${SITE_BUILD_ID}
ENV SITE_BUILD_DIR=${SITE_BUILD_DIR}
ENV SITE_PUBLIC_DIR=${SITE_PUBLIC_DIR}

# Load in the env vars from the Docker Secrets store
RUN --mount=type=secret,id=site-url,env=SITE_URL \
  --mount=type=secret,id=site-env,env=SITE_ENV \
  --mount=type=secret,id=site-port,env=SITE_PORT \
  --mount=type=secret,id=site-author,env=SITE_AUTHOR \
  --mount=type=secret,id=site-title,env=SITE_TITLE \
  --mount=type=secret,id=site-desc,env=SITE_DESC \
  --mount=type=secret,id=site-lang,env=SITE_LANG \
  --mount=type=secret,id=site-feed-title,env=SITE_FEED_TITLE \
  --mount=type=secret,id=site-feed-desc,env=SITE_FEED_DESC \
  --mount=type=secret,id=site-feed-default-title,env=SITE_FEED_DEFAULT_TITLE \
  --mount=type=secret,id=site-posthog-id,env=SITE_POSTHOG_ID \
  --mount=type=secret,id=site-posthog-api-host,env=SITE_POSTHOG_API_HOST \
  --mount=type=secret,id=site-posthog-ui-host,env=SITE_POSTHOG_UI_HOST

# Copy the whole repo directory, besides items filtered out by the Docker Ignore file.
COPY . .

# Setup and build the site
RUN ./task setup
RUN ./task build

# The 'output' stage is the minimum required files and binaries to run the
# static files from the 'build' stage. This minimises the resulting final
# Docker Image size, speeding up build and push times.
FROM denoland/deno:ubuntu AS output
WORKDIR /app

# Set the Deno Task to run, defaulting to 'serve'
ARG DENO_TASK_NAME
ENV DENO_TASK_NAME=${DENO_TASK_NAME:-serve}

# Apply security updates.
RUN apt-get update && apt-get upgrade -y

# Copy over some files and folders from the 'build' stage
COPY --from=build /app/src/backend /app/src/backend
COPY --from=build /app/src/frontend /app/src/frontend
COPY --from=build /app/public /app/public
COPY --from=build /app/deno.json /app/deno.json
COPY --from=build /app/deno.lock /app/deno.lock

# Go setup
COPY --from=build /app/task /app/task
COPY --from=build /usr/local/go /usr/local/go
ENV PATH="/usr/local/go/bin:${PATH}"

RUN mkdir /app/coverage

# Run the specified Deno Task, and allow access to the container via port 8000.
EXPOSE 8000
CMD ["bash", "-c", "deno task ${DENO_TASK_NAME}"]
