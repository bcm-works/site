import { cmdShow } from "@/common/cmd.ts";
import { logInfo } from "@/common/log.ts";
import { Env } from "@/common/env.ts";

cmdShow("deno task docker-stop");

const env = new Env();

const url: string = env.getUrl();
const port: number = env.getPort();
const lang: string = env.get("SITE_LANG", "en-GB");
const author: string = env.get("SITE_AUTHOR");
const buildId: string = env.getBuildId();
const feedTitle: string = env.get("SITE_FEED_TITLE");
const feedDesc: string = env.get("SITE_FEED_DESC");
const feedDefaultTitle: string = env.get("SITE_FEED_DEFAULT_TITLE");
const githubId: string = env.get("SITE_GITHUB_ID");
const postHogId: string = env.get("SITE_POSTHOG_ID");
const postHogApiHost: string = env.get("SITE_POSTHOG_API_HOST");
const postHogUiHost: string = env.get("SITE_POSTHOG_UI_HOST");

logInfo("Starting 'bcm-site' container");

cmdShow(
  `docker run -d \
  --name "bcm-site" \
  --publish "${port}:${port}" \
  --env "SITE_BUILD_ID=${buildId}" \
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
