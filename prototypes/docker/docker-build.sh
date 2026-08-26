#!/usr/bin/env bash
#
#
# Docker build
#
#

REPO="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO"

DOCKERFILE="$REPO/prototypes/docker/Site.Dockerfile"

ENVFILE="$REPO/.env"
if [ -f "$ENVFILE" ]; then
  echo "Env file found, loading variables from it."
  source "$ENVFILE"
else
  echo "No env file found, system environment variables will be used instead."
fi

NOW_DATE=$(date -u +"%Y%m%d.%H%M")
BUILD_ID=${SITE_BUILD_ID:-NOW_DATE}

docker build \
  --pull \
  --no-cache \
  --platform linux/amd64 \
  --tag bcm-site:latest \
  --build-arg SITE_BUILD_ID="${BUILD_ID}" \
  --build-arg SITE_BUILD_DIR="${SITE_BUILD_DIR:-build}" \
  --build-arg SITE_PUBLIC_DIR="${SITE_PUBLIC_DIR:-public}" \
  --secret id=site,src="$ENVFILE" \
  --file "$DOCKERFILE" \
  "."

echo "Docker build finished."
