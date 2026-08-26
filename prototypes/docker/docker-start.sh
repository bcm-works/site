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

rm -rf "$REPO/coverage" > /dev/null 2>&1 || true

NOW_DATE=$(date -u +"%Y%m%d.%H%M")
BUILD_ID=${SITE_BUILD_ID:-NOW_DATE}

TASK_NAME=${DENO_TASK_NAME:-serve}

ENVFILE="$REPO/.env"
if [ -f "$ENVFILE" ]; then
  echo "Env file found, loading vars from it."

  docker run -d \
    --name "bcm-site" \
    --publish "${SITE_PORT:-8000}:8000" \
    --env "DENO_TASK_NAME=${TASK_NAME}" \
    --env "SITE_BUILD_ID=${BUILD_ID}" \
    --env-file "${ENVFILE}" \
    "bcm-site:latest" > /dev/null 2>&1
else
  echo "No env file found, relying on system environment vars."

  docker run -d \
    --name "bcm-site" \
    --publish "${SITE_PORT:-8000}:8000" \
    --env "DENO_TASK_NAME=${TASK_NAME}" \
    --env "SITE_BUILD_ID=${BUILD_ID}" \
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
fi

echo "Docker container started."
