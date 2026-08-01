import { cmdShow } from "@/tasks/cmd.ts";
import { format } from "date-fns";
import { info } from "@/tasks/log.ts";
import { loadEnv } from "@/tasks/env.ts";

loadEnv();

cmdShow("deno task docker-stop");

const url: string = process.env.SITE_URL || "http://localhost";
const port: number = Number(process.env.SITE_PORT) || 8000;
const lang: string = process.env.SITE_LANG || "en-GB";
const author: string = process.env.SITE_AUTHOR || "";

const dateNow: Date = new Date();
const buildDate: string = process.env.SITE_BUILD_ID || format(dateNow, "yyyyMMddHHmmss");

const feedTitle: string = process.env.SITE_FEED_TITLE || "";
const feedDesc: string = process.env.SITE_FEED_DESC || "";
const feedDefaultTitle: string = process.env.SITE_FEED_DEFAULT_TITLE || "";

const githubId: string = process.env.SITE_GITHUB_ID || "";
const postHogId: string = process.env.SITE_POSTHOG_ID || "";
const postHogApiHost: string = process.env.SITE_POSTHOG_API_HOST || "";
const postHogUiHost: string = process.env.SITE_POSTHOG_UI_HOST || "";

info("Starting 'bcm-site' container");

cmdShow(
  `docker run -d \
  --name "bcm-site" \
  --publish "${port}:${port}" \
  --env "SITE_BUILD_ID=${buildDate}" \
  --env "SITE_FEED_TITLE=${feedTitle}" \
  --env "SITE_FEED_DESC=${feedDesc}" \
  --env "SITE_FEED_DEFAULT_TITLE=${feedDefaultTitle}" \
  --env "SITE_LANG=${lang}" \
  --env "SITE_AUTHOR=${author}" \
  --env "SITE_URL=${url}" \
  --env "SITE_PORT=${port}" \
  --env "SITE_GITHUB_ID=${githubId}" \
  --env "SITE_POSTHOG_ID=${postHogId}" \
  --env "SITE_POSTHOG_API_HOST=${postHogApiHost}" \
  --env "SITE_POSTHOG_UI_HOST=${postHogUiHost}" \
  "bcm-site:latest"`,
);
