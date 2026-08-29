#!/usr/bin/env bash
#
#
# Docker build
#
#

set -euo pipefail

REPO="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO"

DOCKERFILE="$REPO/.prototypes/docker/Site.Dockerfile"

ENVFILE="$REPO/.env"
TEMP_ENVFILE=""

cleanup() {
  if [ -n "$TEMP_ENVFILE" ]; then
    rm -f "$TEMP_ENVFILE"
  fi
}
trap cleanup EXIT

if [ -f "$ENVFILE" ]; then
  echo "Env file found; using it for build-time site configuration."
else
  echo "No env file found; using system environment variables for build-time site configuration."
  TEMP_ENVFILE="$(mktemp)"
  ENVFILE="$TEMP_ENVFILE"

  BUILD_ENV_VARS=(
    SITE_ENV
    SITE_URL
    SITE_AUTHOR
    SITE_TITLE
    SITE_DESC
    SITE_LANG
    SITE_TIMEZONE
    SITE_REPO
    SITE_FEED_TITLE
    SITE_FEED_DESC
    SITE_FEED_DEFAULT_TITLE
    SITE_POSTHOG_ID
    SITE_POSTHOG_API_HOST
    SITE_POSTHOG_UI_HOST
  )

  for var_name in "${BUILD_ENV_VARS[@]}"; do
    if [ -n "${!var_name-}" ]; then
      value="${!var_name}"
      value="${value//\\/\\\\}"
      value="${value//\"/\\\"}"
      value="${value//$'\n'/\\n}"
      printf '%s="%s"\n' "$var_name" "$value" >> "$ENVFILE"
    fi
  done
fi

CONFIG_HASH=$(git hash-object "$ENVFILE")

docker build \
  --platform linux/amd64 \
  --tag bcm-site:latest \
  --build-arg SITE_BUILD_DIR="${SITE_BUILD_DIR:-build}" \
  --build-arg SITE_CONFIG_HASH="${CONFIG_HASH}" \
  --build-arg SITE_PUBLIC_DIR="${SITE_PUBLIC_DIR:-public}" \
  --secret id=site,src="$ENVFILE" \
  --file "$DOCKERFILE" \
  "."

echo "Docker build finished."
