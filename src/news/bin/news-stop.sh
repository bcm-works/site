#!/usr/bin/env bash
#
#
# Stop the local version of News
#
#

NEWS="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$NEWS/.news.env"
cd "$NEWS"

if [ -f "$ENV_FILE" ]; then
  source "$ENV_FILE"
fi

# The name of the Docker container to use when running.
# Defaulting to 'commafeed'.
NEWS_CONTAINER_NAME=${NEWS_CONTAINER_NAME:-"commafeed"}

docker container stop "$NEWS_CONTAINER_NAME" > /dev/null 2>&1 && \
  docker container rm "$NEWS_CONTAINER_NAME" > /dev/null 2>&1 || \
  true

echo "Stopped and removed Docker container '$NEWS_CONTAINER_NAME'"

exit 0
