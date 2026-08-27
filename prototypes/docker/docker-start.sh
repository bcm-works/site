#!/usr/bin/env bash
#
#
# Docker start
#
#

set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO"

bash "${DIR}/docker-stop.sh"

NOW_DATE=$(date -u +"%Y%m%d.%H%M")
BUILD_ID=${SITE_BUILD_ID:-$NOW_DATE}

ENVFILE="$REPO/.env"
if [ -f "$ENVFILE" ]; then
  echo "Env file found, loading vars from it."

  set -a
  source "$ENVFILE"
  set +a
  CONTAINER_PORT="${PORT:-${SITE_PORT:-8000}}"

  CONTAINER_ID=$(docker run -d \
    --name "bcm-site" \
    --publish "${CONTAINER_PORT}:${CONTAINER_PORT}" \
    --env "SITE_BUILD_ID=${BUILD_ID}" \
    --env-file "${ENVFILE}" \
    "bcm-site:latest")
else
  echo "No env file found, relying on system environment vars."

  CONTAINER_PORT="${PORT:-${SITE_PORT:-8000}}"
  RUN_ENV_ARGS=()
  RUNTIME_ENV_VARS=(
    PORT
    SITE_ENV
    SITE_URL
    SITE_AUTHOR
    SITE_TITLE
    SITE_DESC
    SITE_LANG
    SITE_TIMEZONE
    SITE_REPO
    SITE_PORT
    SITE_FEED_TITLE
    SITE_FEED_DESC
    SITE_FEED_DEFAULT_TITLE
    SITE_GITHUB_ID
    SITE_POSTHOG_ID
    SITE_POSTHOG_API_HOST
    SITE_POSTHOG_UI_HOST
  )

  for var_name in "${RUNTIME_ENV_VARS[@]}"; do
    if [ -n "${!var_name-}" ]; then
      RUN_ENV_ARGS+=(--env "$var_name")
    fi
  done

  CONTAINER_ID=$(docker run -d \
    --name "bcm-site" \
    --publish "${CONTAINER_PORT}:${CONTAINER_PORT}" \
    --env "SITE_BUILD_ID=${BUILD_ID}" \
    "${RUN_ENV_ARGS[@]}" \
    "bcm-site:latest")
fi

echo "Docker container started: ${CONTAINER_ID}"
