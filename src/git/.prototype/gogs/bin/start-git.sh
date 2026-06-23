#!/usr/bin/env bash
#
#
# Start the local version of Git (Gogs)
#   - Docs at https://github.com/gogs/gogs/blob/main/docker-next/README.md
#
#

# REPO="$(cd "$(dirname "$0")/../../.." && pwd)"
REPO="$(cd "$(dirname "$0")/../../../../.." && pwd)"
source "$REPO/bin/.helper.sh"
# GIT="$REPO/src/git"
GIT="$(cd "$(dirname "$0")/.." && pwd)"
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

mkdir -p "$STORAGE_DIR_CUSTOM"
mkdir -p "$STORAGE_DIR_CONF"
mkdir -p "$STORAGE_DIR_GIT"
mkdir -p "$STORAGE_DIR_SSH"

chown -R "$USER_UID:$USER_GID" "$STORAGE_DIR_CUSTOM"
chown -R "$USER_UID:$USER_GID" "$STORAGE_DIR_CONF"
chown -R "$USER_UID:$USER_GID" "$STORAGE_DIR_GIT"
chown -R "$USER_UID:$USER_GID" "$STORAGE_DIR_SSH"

info "Build the local Docker container"

# docker pull gogs/gogs:next-latest
# docker build -f Dockerfile.next --build-arg GOGS_UID=1001 --build-arg GOGS_GID=1001 -t my-gogs .
# docker volume create --name "$APP_NAME-data"

docker run -d \
  --name="$APP_NAME-$APP_ENV" \
  --env-file="$ENV_FILE" \
  --publish "$WEB_PORT:3000" \
  --publish "$SSH_PORT:$SSH_LISTEN_PORT" \
  --volume "$STORAGE_DIR_CONF:/data/gogs/conf" \
  --volume "$STORAGE_DIR_CUSTOM:/etc/gogs" \
  --volume "$STORAGE_DIR_GIT:/data/git" \
  --volume "$STORAGE_DIR_SSH:/data/ssh" \
  gogs/gogs:next-latest && \
  success "Git started at http://localhost:$WEB_PORT/"
