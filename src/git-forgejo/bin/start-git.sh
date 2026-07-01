#!/usr/bin/env bash
#
#
# Start the local version of Git
#  - Run via: just git-start
#
#

REPO="$(cd "$(dirname "$0")/../../.." && pwd)"
source "$REPO/bin/.helper.sh"
GIT="$REPO/src/git"
cd "$GIT"

ENV_FILE="$GIT/.git.env"

USER_UID="$(id -u)"
USER_GID="$(id -g)"

if [ -f "$ENV_FILE" ]; then
  warn "Loading variables from '$ENV_FILE'"
else
  error "No environment file found at '$ENV_FILE'"
  exit 1
fi

source "$ENV_FILE"

info "Initialising volume directories and user ownership"

mkdir -p "$STORAGE_DIR_APP"
mkdir -p "$STORAGE_DIR_DATA"
mkdir -p "$STORAGE_DIR_GIT"
mkdir -p "$STORAGE_DIR_CUSTOM/conf"

chown -R "$USER_UID:$USER_GID" "$STORAGE_DIR_APP"
chown -R "$USER_UID:$USER_GID" "$STORAGE_DIR_DATA"
chown -R "$USER_UID:$USER_GID" "$STORAGE_DIR_GIT"
chown -R "$USER_UID:$USER_GID" "$STORAGE_DIR_CUSTOM"

info "Run: Docker Compose Up"

export USER_UID="$USER_UID" && \
  export USER_GID="$USER_GID" && \
  docker compose \
    --file "$GIT/docker-compose.local.yml" \
    --env-file "$ENV_FILE" \
    up \
    --pull always \
    --build \
    -d && \
  success "Git started at http://localhost:$PORT_WEB/"
