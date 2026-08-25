#!/usr/bin/env bash
#
#
# Docker build
#
#

REPO="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO"

ENV="$REPO/.env"
if [ -f "$ENV" ]; then
  echo "Env file found, loading variables from it."
  source "$ENV"
else
  echo "No file found at $ENV, system environment variables will be used instead."
fi

docker buildx build \
  --pull \
  --no-cache \
  --platform linux/amd64 \
  --tag bcm-site:latest \
  --build-arg SITE_TITLE="${SITE_TITLE}" \
  --build-arg SITE_AUTHOR="${SITE_AUTHOR}" \
  --build-arg SITE_LANG="${SITE_LANG}" \
  --build-arg SITE_URL="${SITE_URL}" \
  --build-arg SITE_PORT="${SITE_PORT}" \
  --build-arg SITE_FEED_TITLE="${SITE_FEED_TITLE}" \
  --build-arg SITE_FEED_DESC="${SITE_FEED_DESC}" \
  --build-arg SITE_FEED_DEFAULT_TITLE="${SITE_FEED_DEFAULT_TITLE}" \
  --build-arg SITE_POSTHOG_ID="${SITE_POSTHOG_ID}" \
  --build-arg SITE_POSTHOG_API_HOST="${SITE_POSTHOG_API_HOST}" \
  --build-arg SITE_POSTHOG_UI_HOST="${SITE_POSTHOG_UI_HOST}" \
  --file "src/docker/Site.Dockerfile" \
  "."

echo "Docker build finished."
