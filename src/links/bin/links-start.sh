#!/usr/bin/env bash
#
#
# Start the local version of Links
#
#

REPO="$(cd "$(dirname "$0")/../../.." && pwd)"
source "$REPO/bin/.helper.sh"
LINKS="$REPO/src/links"
cd "$LINKS"

ENV_FILE="$LINKS/.links.env"

if [ ! -f "$ENV_FILE" ]; then
  error "Env file not found at '$ENV_FILE'"
  exit 1
fi

source "$LINKS/.links.env"

mkdir -p "$STORAGE_DIR_APP"
mkdir -p "$STORAGE_DIR_SEARCH"

PORT="$PORT" \
  OPENAI_API_KEY="$OPENAI_API_KEY" \
  STORAGE_DIR_APP="$STORAGE_DIR_APP" \
  STORAGE_DIR_SEARCH="$STORAGE_DIR_SEARCH" \
  MEILI_MASTER_KEY="$MEILI_MASTER_KEY" \
  docker compose \
  --file "$LINKS_DIR/docker-compose.local.yml" \
  --env-file "$LINKS_DIR/.links.env" \
  up --pull always --build -d

echo "Links started at http://localhost:$PORT/"
