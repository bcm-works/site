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

cd "$DIR"

rm -rf "$DIR/cli"
rm -rf "$REPO/task"

go build .

mv "$DIR/cli" "$REPO/task"
