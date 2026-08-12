#!/usr/bin/env bash
#
#
# bcm CLI - Rebuild the binary using Go Build
#
#

DIR="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$(dirname "$0")/../.." && pwd)"

ENV="$REPO/config/.env"

if [ ! -f "$ENV" ]; then
  echo "Warning: No file found at $ENV, system environment variables will be used instead."
fi

rm -rf "$DIR/cli"
rm -rf "$REPO/task"

cd "$DIR"
go build -ldflags="-s -w" .

mv "$DIR/cli" "$REPO/task"
