#!/usr/bin/env bash
#
#
# Start the local version of News (Commafeed)
#   - More info at https://github.com/Athou/commafeed/
#
#

NEWS="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$NEWS/.news.env"
cd "$NEWS"

if [ -f "$ENV_FILE" ]; then
  source "$ENV_FILE"
fi

# The Docker Image to use when running.
# Defaulting to 'athou/commafeed:latest-h2'.
NEWS_CONTAINER_IMAGE=${NEWS_CONTAINER_IMAGE:-"athou/commafeed:latest-h2"}

# The name of the Docker container to use when running.
# Defaults to 'commafeed'.
NEWS_CONTAINER_NAME=${NEWS_CONTAINER_NAME:-"commafeed"}

# The domain for the system.
# Defaults to 'localhost'.
NEWS_HOST_DOMAIN=${NEWS_HOST_DOMAIN:-"localhost"}

# The protocol used for this system (http or https).
# Defaults to 'http'.
NEWS_HOST_PROTOCOL=${NEWS_HOST_PROTOCOL:-"http"}

# The port on the host to use to access the app.
# Defaults to '8082'.
NEWS_HOST_PORT=${NEWS_HOST_PORT:-"8082"}

# Path on this host machine to the data directory.
# Defaults to a dir named 'data' in the same dir as this file.
NEWS_STORAGE_DIR=${NEWS_STORAGE_DIR:-"./data"}

mkdir -p "$NEWS_STORAGE_DIR"

bash "$NEWS/bin/news-stop.sh"

docker run --detach \
  --name "$NEWS_CONTAINER_NAME" \
  --publish "$NEWS_HOST_PORT:8082" \
  --volume "$NEWS_STORAGE_DIR:/commafeed/data" \
  --memory 256M \
  "$NEWS_CONTAINER_IMAGE" > /dev/null 2>&1 && \
  echo "Started Docker container '$NEWS_CONTAINER_IMAGE'"

echo "News system starting at $NEWS_HOST_PROTOCOL://$NEWS_HOST_DOMAIN:$NEWS_HOST_PORT/"
