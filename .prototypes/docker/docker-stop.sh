#!/usr/bin/env bash
#
#
# Docker stop
#
#

set -euo pipefail

if docker container inspect bcm-site > /dev/null 2>&1; then
  docker stop bcm-site > /dev/null
  docker rm bcm-site > /dev/null
fi

echo "Docker container stopped."
