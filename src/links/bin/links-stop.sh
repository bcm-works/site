#!/usr/bin/env bash
#
#
# Stop the local version of Links
#
#

LINKS_DIR="$(cd "$(dirname "$0")" && cd .. && pwd)"

cd "$LINKS_DIR"

docker compose \
  --file "$LINKS_DIR/docker-compose.local.yml" \
  down > /dev/null 2>&1

exit 0
