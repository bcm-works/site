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

bash "$GIT/bin/stop-git.sh"

info "Initialising volume directories and user ownership"

mkdir -p "$STORAGE_DIR_APP"
mkdir -p "$STORAGE_DIR_CUSTOM/conf"

chown -R "$USER_UID:$USER_GID" "$STORAGE_DIR_APP"
chown -R "$USER_UID:$USER_GID" "$STORAGE_DIR_CUSTOM"

info "Building local Docker Image"

docker build \
  --tag "$APP_NAME:latest" \
  --build-arg USER_UID="$USER_UID" \
  --build-arg USER_GID="$USER_GID" \
  --build-arg APP_NAME="$APP_NAME" \
  --build-arg APP_ENV="$APP_ENV" \
  --build-arg APP_SLOGAN="$APP_SLOGAN" \
  --build-arg APP_DISPLAY_NAME_FORMAT="$APP_DISPLAY_NAME_FORMAT" \
  --build-arg ROOT_URL="$ROOT_URL" \
  --build-arg APP_THEME_LIST="$APP_THEME_LIST" \
  --build-arg APP_THEME_DEFAULT="$APP_THEME_DEFAULT" \
  "."

info "Starting local Docker Container"

docker run -d \
  --name "$APP_NAME" \
  --publish ${PORT_WEB}:3000 \
  --publish ${PORT_SSH}:22 \
  --env "USER_UID=${USER_UID}" \
  --env "USER_GID=${USER_GID}" \
  --mount "type=bind,source=${STORAGE_DIR_APP},destination=/data" \
  --mount "type=bind,source=${STORAGE_DIR_CUSTOM},destination=/data/gitea" \
  "$APP_NAME:latest" && \
  success "Git started at http://localhost:$PORT_WEB/"