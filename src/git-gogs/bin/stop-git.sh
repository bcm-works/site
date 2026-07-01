#!/usr/bin/env bash
#
#
# Stop the local version of Git (Gogs)
#
#

REPO="$(cd "$(dirname "$0")/../../.." && pwd)"
source "$REPO/bin/.helper.sh"
GIT="$REPO/src/git"
cd "$GIT"

ENV_FILE="$GIT/.git.env"

if [ -f "$ENV_FILE" ]; then
  warn "Loading variables from '$ENV_FILE'"
else
  error "No environment file found at '$ENV_FILE'"
  exit 1
fi

source "$ENV_FILE"

if [ "$(docker ps -aq -f name=${APP_NAME}-${APP_ENV}-gogs)" ]; then
  info "Stopping and removing '${APP_NAME}-${APP_ENV}-gogs' container"

  docker stop "${APP_NAME}-${APP_ENV}-gogs" > /dev/null 2>&1
  docker rm "${APP_NAME}-${APP_ENV}-gogs" > /dev/null 2>&1
fi

if [ "$(docker ps -aq -f name=${APP_NAME}-${APP_ENV})-postgres" ]; then
  info "Stopping and removing '${APP_NAME}-${APP_ENV}-postgres' container"

  docker stop "${APP_NAME}-${APP_ENV}-postgres" > /dev/null 2>&1
  docker rm "${APP_NAME}-${APP_ENV}-postgres" > /dev/null 2>&1
fi

exit 0
