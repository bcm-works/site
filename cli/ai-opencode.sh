#!/usr/bin/env bash
#
#
# Run the OpenCode CLI tool using project specific config
#   - Can also be run from the repo root: deno task ai:opencode
#
#

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DIR="$REPO/cli"

OPENCODE_CLI_CONFIG_CONTENT='{"theme":{"name":"bcm"}}' \
  opencode

