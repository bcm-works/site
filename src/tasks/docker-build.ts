import { cmdShow } from "@/common/cmd.ts";
import { logInfo } from "@/common/log.ts";
import { Env } from "@/common/env.ts";

const env = new Env();

const url: string = env.getUrl();
const port: number = env.getPort();
const lang: string = env.get("SITE_LANG", "en-GB");
const author: string = env.get("SITE_AUTHOR");
const feedTitle: string = env.get("SITE_FEED_TITLE");
const feedDesc: string = env.get("SITE_FEED_DESC");
const feedDefaultTitle: string = env.get("SITE_FEED_DEFAULT_TITLE");
const postHogId: string = env.get("SITE_POSTHOG_ID");
const postHogApiHost: string = env.get("SITE_POSTHOG_API_HOST");
const postHogUiHost: string = env.get("SITE_POSTHOG_UI_HOST");

logInfo("Building 'bcm-site' Docker Image");

cmdShow(
  `docker buildx build \
  --pull \
  --no-cache \
  --quiet \
  --platform linux/amd64 \
  --tag bcm-site:latest \
  --build-arg SITE_FEED_TITLE="${feedTitle}" \
  --build-arg SITE_FEED_DESC="${feedDesc}" \
  --build-arg SITE_FEED_DEFAULT_TITLE="${feedDefaultTitle}" \
  --build-arg SITE_LANG="${lang}" \
  --build-arg SITE_AUTHOR="${author}" \
  --build-arg SITE_URL="${url}" \
  --build-arg SITE_PORT="${port}" \
  --build-arg SITE_POSTHOG_ID="${postHogId}" \
  --build-arg SITE_POSTHOG_API_HOST="${postHogApiHost}" \
  --build-arg SITE_POSTHOG_UI_HOST="${postHogUiHost}" \
  --file "src/Site.Dockerfile" \
  "."`
);
