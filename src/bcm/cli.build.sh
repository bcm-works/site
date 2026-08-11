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
  echo "Warning: No file found at $ENV, system environment variables will be used instead."
fi

cd "$DIR"

rm -rf "$DIR/$BIN"
rm -rf "$REPO/$BIN"

go build .

mv "$DIR/$BIN" "$REPO/$BIN"
