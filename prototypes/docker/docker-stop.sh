#!/usr/bin/env bash
#
#
# Docker stop
#
#

REPO="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$REPO"

docker stop bcm-site > /dev/null 2>&1 || true
docker rm bcm-site > /dev/null 2>&1 || true

echo "Docker container stopped."
