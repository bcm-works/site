import { cmdShow } from "@/tasks/cmd.ts";
import { info } from "@/tasks/log.ts";
import { loadEnv } from "@/tasks/local.ts";

loadEnv();

const url: string = process.env.SITE_URL || "http://localhost";
const port: number = Number(process.env.SITE_PORT) || 8000;
const lang: string = process.env.SITE_LANG || "en-GB";
const author: string = process.env.SITE_AUTHOR || "";

const feedTitle: string = process.env.SITE_FEED_TITLE || "";
const feedDesc: string = process.env.SITE_FEED_DESC || "";
const feedDefaultTitle: string = process.env.SITE_FEED_DEFAULT_TITLE || "";

const postHogId: string = process.env.SITE_POSTHOG_ID || "";
const postHogApiHost: string = process.env.SITE_POSTHOG_API_HOST || "";
const postHogUiHost: string = process.env.SITE_POSTHOG_UI_HOST || "";

info("Building 'bcm-site' Docker Image");

cmdShow(
  `docker buildx build \
  --pull \
  --no-cache \
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
  "."`,
);
