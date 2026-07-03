#!/usr/bin/env bash
#
#
# Build the site, run tests, then push new Docker Image to Docker Hub
#  - Run from src/site: deno task release
#
#

SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$SITE_DIR"

# Setup the message colour characters

GREEN="\033[0;32m"
YELLOW="\033[0;33m"
RED="\033[0;31m"
NC="\033[0m"

# Load Env Vars

if [ -f "$SITE_DIR/.site.env" ]; then
  source "$SITE_DIR/.site.env"
else
  echo -e "${RED}File not found at '.site.env'${NC}"
  exit 1
fi

# Configure release variables

TIMESTAMP="$(TZ='Australia/Sydney' date +%Y%m%d.%H%M)"
COMMIT="$(git rev-parse --short HEAD)"
BRANCH="$(git branch --show-current)"
SITE_DOCKER_IMAGE_URL="docker.io/$SITE_DOCKER_IMAGE_PATH"

# Prompt the user to continue or not

echo -e "${YELLOW}This script will push a new Docker Image to Docker Hub and trigger a Railway deployment.${NC}"
read -p "Do you want to continue? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${RED}Release cancelled${NC}"
  exit 1
fi

echo -e "${GREEN}Release confirmed: $TIMESTAMP${NC}"

echo -e "${YELLOW}Install dependencies${NC}"

deno ci --quiet

echo -e "${YELLOW}Build site${NC}"

deno task build

echo -e "${YELLOW}Build Docker Image${NC}"

deno task docker-build

echo -e "${YELLOW}Run tests${NC}"

deno task test || exit 1

echo -e "${YELLOW}Login to Docker Hub${NC}"

echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin

echo -e "${YELLOW}Build Docker Image for Docker Hub${NC}"

docker buildx build \
  --pull \
  --no-cache \
  --progress=plain \
  --platform linux/amd64 \
  --provenance=true \
  --sbom=true \
  --attest type=provenance,mode=max \
  --tag "$SITE_DOCKER_IMAGE_URL:latest" \
  --tag "$SITE_DOCKER_IMAGE_URL:commit-$COMMIT" \
  --tag "$SITE_DOCKER_IMAGE_URL:branch-$BRANCH" \
  --tag "$SITE_DOCKER_IMAGE_URL:release-$TIMESTAMP" \
  --label "maintainer=$SITE_AUTHOR" \
  --label "org.opencontainers.image.licenses=MIT" \
  --label "org.opencontainers.image.title=$SITE_TITLE" \
  --label "org.opencontainers.image.description=$SITE_DESC" \
  --label "org.opencontainers.image.authors=$SITE_AUTHOR" \
  --label "org.opencontainers.image.vendor=$SITE_AUTHOR" \
  --label "org.opencontainers.image.url=$SITE_REPO" \
  --label "org.opencontainers.image.source=$SITE_REPO" \
  --label "org.opencontainers.image.version=$TIMESTAMP" \
  --label "org.opencontainers.image.revision=$COMMIT" \
  --build-arg SITE_FEED_TITLE="$SITE_FEED_TITLE" \
  --build-arg SITE_FEED_DESC="$SITE_FEED_DESC" \
  --build-arg SITE_FEED_DEFAULT_TITLE="$SITE_FEED_DEFAULT_TITLE" \
  --build-arg SITE_LANG="$SITE_LANG" \
  --build-arg SITE_AUTHOR="$SITE_AUTHOR" \
  --build-arg SITE_URL="$SITE_URL" \
  --build-arg SITE_PORT="$SITE_PORT" \
  --build-arg SITE_POSTHOG_ID="$SITE_POSTHOG_ID" \
  --build-arg SITE_POSTHOG_API_HOST="$SITE_POSTHOG_API_HOST" \
  --build-arg SITE_POSTHOG_UI_HOST="$SITE_POSTHOG_UI_HOST" \
  "."

echo -e "${YELLOW}Push Docker Image to Docker Hub${NC}"

docker push "$SITE_DOCKER_IMAGE_URL:latest"
docker push "$SITE_DOCKER_IMAGE_URL:commit-$COMMIT"
docker push "$SITE_DOCKER_IMAGE_URL:branch-$BRANCH"
docker push "$SITE_DOCKER_IMAGE_URL:release-$TIMESTAMP"

echo -e "${YELLOW}Generate release notes${NC}"

mise run release-notes "$SITE_DIR/release-notes.log"

echo -e "${YELLOW}Create and push a new Git Tag${NC}"

git tag -a "release-$TIMESTAMP" -m "$(cat $SITE_DIR/release-notes.log)"
git push --tags --quiet

echo -e "${GREEN}Release complete${NC}"
