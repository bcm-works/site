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

info "Initialising volume directories and setting ownership"

mkdir -p "$STORAGE_DIR_CUSTOM"
mkdir -p "$STORAGE_DIR_GIT"
mkdir -p "$STORAGE_DIR_SSH"
mkdir -p "$STORAGE_DIR_POSTGRES"

chown -R "$USER_UID:$USER_GID" "$STORAGE_DIR_CUSTOM"
chown -R "$USER_UID:$USER_GID" "$STORAGE_DIR_GIT"
chown -R "$USER_UID:$USER_GID" "$STORAGE_DIR_SSH"
chown -R "$USER_UID:$USER_GID" "$STORAGE_DIR_POSTGRES"

chmod -R 775 "$STORAGE_DIR_CUSTOM"
chmod -R 775 "$STORAGE_DIR_GIT"
chmod -R 775 "$STORAGE_DIR_SSH"
chmod -R 775 "$STORAGE_DIR_POSTGRES"

info "Create the local Docker network"

docker network create "$APP_NAME-$APP_ENV-network" > /dev/null 2>&1 || true

info "Run the local Docker container for Postgres"

docker run -d \
  --name "$APP_NAME-$APP_ENV-postgres" \
  --pull=always \
  --network "$APP_NAME-$APP_ENV-network" \
  --publish "5432:5432" \
  --env "POSTGRES_DB=$GOGS_DATABASE_NAME" \
  --env "POSTGRES_USER=$GOGS_DATABASE_USER" \
  --env "POSTGRES_PASSWORD=$GOGS_DATABASE_PASSWORD" \
  --volume "$STORAGE_DIR_POSTGRES:/var/lib/postgresql" \
  postgres:18

info "Build the local Docker image for Gogs"

docker build \
  --pull \
  --tag "$APP_NAME-$APP_ENV-gogs:latest" \
  --build-arg USER_UID="$USER_UID" \
  --build-arg USER_GID="$USER_GID" \
  --build-arg SSH_LISTEN_PORT="$SSH_LISTEN_PORT" \
  "."

info "Run the local Docker container for Gogs"

docker run -d \
  --name="$APP_NAME-$APP_ENV-gogs" \
  --network "$APP_NAME-$APP_ENV-network" \
  --publish "$WEB_PORT:3000" \
  --publish "$SSH_PORT:$SSH_LISTEN_PORT" \
  --env-file="$ENV_FILE" \
  --user "$USER_UID:$USER_GID" \
  --volume "$STORAGE_DIR_CUSTOM:/data/gogs" \
  --volume "$STORAGE_DIR_GIT:/data/git/gogs-repositories" \
  --volume "$STORAGE_DIR_SSH:/data/ssh" \
  "$APP_NAME-$APP_ENV-gogs:latest" && \
  success "Git started at http://localhost:$WEB_PORT/"
