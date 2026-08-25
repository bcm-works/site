#!/usr/bin/env bash
#
#
# Docker start
#
#

DIR="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO"

bash "${DIR}/docker-stop.sh"

ENV="$REPO/.env"
if [ -f "$ENV" ]; then
  echo "Env file found, loading variables from it."
  source "$ENV"
else
  echo "No file found at $ENV, system environment variables will be used instead."
fi

rm -rf "$REPO/coverage" > /dev/null 2>&1 || true

NOW_DATE=$(date -u +"%Y%m%d%H%M%S")
BUILD_DATE=${SITE_BUILD_DATE:-NOW_DATE}

TASK_NAME=${DENO_TASK_NAME:-serve}

docker run -d \
  --name "bcm-site" \
  --publish "${SITE_PORT:-8000}:8000" \
  --env "DENO_TASK_NAME=${TASK_NAME}" \
  --env "SITE_BUILD_DATE=${BUILD_DATE}" \
  --env "SITE_TITLE=${SITE_TITLE}" \
  --env "SITE_LANG=${SITE_LANG}" \
  --env "SITE_AUTHOR=${SITE_AUTHOR}" \
  --env "SITE_URL=${SITE_URL}" \
  --env "SITE_PORT=${SITE_PORT}" \
  --env "SITE_FEED_TITLE=${SITE_FEED_TITLE}" \
  --env "SITE_FEED_DESC=${SITE_FEED_DESC}" \
  --env "SITE_FEED_DEFAULT_TITLE=${SITE_FEED_DEFAULT_TITLE}" \
  --env "SITE_POSTHOG_ID=${SITE_POSTHOG_ID}" \
  --env "SITE_POSTHOG_API_HOST=${SITE_POSTHOG_API_HOST}" \
  --env "SITE_POSTHOG_UI_HOST=${SITE_POSTHOG_UI_HOST}" \
  "bcm-site:latest" > /dev/null 2>&1

echo "Docker container started."
