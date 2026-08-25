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
    curl \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Download and setup Go
ARG GO_VERSION=1.26.6
RUN curl -fsSL "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz" \
    | tar -C /usr/local -xzf -
ENV PATH="/usr/local/go/bin:${PATH}"

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

ARG DENO_TASK_NAME
ENV DENO_TASK_NAME=${DENO_TASK_NAME:-serve}

# Apply security updates and install required packages.
RUN apt-get update && apt-get upgrade -y

# Copy over some files and folders from the 'build' stage
COPY --from=build --chown=deno:deno /app/src/backend /app/src/backend
COPY --from=build --chown=deno:deno /app/src/frontend /app/src/frontend
COPY --from=build --chown=deno:deno /app/public /app/public
COPY --from=build --chown=deno:deno /app/deno.json /app/deno.json
COPY --from=build --chown=deno:deno /app/deno.lock /app/deno.lock

# Go setup
COPY --from=build --chown=deno:deno /app/task /app/task
COPY --from=build --chown=deno:deno /usr/local/go /usr/local/go
ENV PATH="/usr/local/go/bin:${PATH}"

RUN mkdir /app/coverage && chown -R deno:deno /app/coverage

# Run the specified Deno Task as the non-root user 'deno' on port 8000.
USER deno
EXPOSE 8000
CMD ["bash", "-c", "deno task ${DENO_TASK_NAME}"]
