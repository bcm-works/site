#!/usr/bin/env bash
#
#
# Rebuild the CLI binary
#   - Rebuilds the binary at "../task"
#   - Can also be run from the repo root: deno task cli:build
#
#

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DIR="$REPO/cli"
ENV="$REPO/.env"

if [ ! -f "$ENV" ]; then
  echo "Warning: No file found at $ENV, system environment variables will be used instead."
fi

rm -rf "$DIR/cli"
rm -rf "$REPO/task"

cd "$DIR"
asdf exec go build -ldflags="-s -w" .

mv "$DIR/cli" "$REPO/task"
