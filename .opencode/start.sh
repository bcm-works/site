#!/usr/bin/env bash
#
#
# Run the OpenCode CLI tool using project specific config
#   - Can also be run from the repo root: deno task ai
#
#

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DIR="$REPO/cli"
OPENCODE="$REPO/.opencode"

CFG=$(cat "$OPENCODE/cli.json")

OPENCODE_CLI_CONFIG_CONTENT=$CFG opencode

