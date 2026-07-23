import { execSync as run } from 'node:child_process';
import { existsSync as exists } from 'node:fs';
import { info, success, warn, error } from '#tools/log';
import { loadEnv } from '#tools/env';

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

const gitCommitShortSha: string = run('git rev-parse --short HEAD').toString().trim();

info("Building 'bcm-site-local' Docker Image");

run(`docker buildx build \
  --pull \
  --no-cache \
  --platform linux/amd64 \
  --tag bcm-site-local:latest \
  --tag bcm-site-local:commit-${gitCommitShortSha} \
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
  "."`, { stdio: 'inherit' });
