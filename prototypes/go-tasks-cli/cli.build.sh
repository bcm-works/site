#!/usr/bin/env bash
#
#
# bcm CLI - Rebuild the binary using Go Build
#
#

DIR="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$(dirname "$0")/../.." && pwd)"

BIN="bcm"
ENV="$REPO/config/.env"

if [ ! -f "$ENV" ]; then
  echo "No .env file found at $ENV"
  exit 1
fi

ln -sf "$ENV" "$DIR/.env"

cd "$DIR"

rm -rf "$DIR/$BIN"
rm -rf "$REPO/$BIN"

go build .

mv "$DIR/$BIN" "$REPO/$BIN"
