import { execSync as run } from 'node:child_process';
import { existsSync as exists } from 'node:fs';
import { info, success, warn, error } from '#tools/log';
import { loadEnv } from '#tools/env';

loadEnv();

run('nub run docker-stop', { stdio: 'inherit' });

const url: string = process.env.SITE_URL || "http://localhost";
const port: number = Number(process.env.SITE_PORT) || 8000;
const lang: string = process.env.SITE_LANG || "en-GB";
const author: string = process.env.SITE_AUTHOR || "";

const feedTitle: string = process.env.SITE_FEED_TITLE || "";
const feedDesc: string = process.env.SITE_FEED_DESC || "";
const feedDefaultTitle: string = process.env.SITE_FEED_DEFAULT_TITLE || "";

const githubId: string = process.env.SITE_GITHUB_ID || "";
const postHogId: string = process.env.SITE_POSTHOG_ID || "";
const postHogApiHost: string = process.env.SITE_POSTHOG_API_HOST || "";
const postHogUiHost: string = process.env.SITE_POSTHOG_UI_HOST || "";

info("Starting 'bcm-site-local' container");

run(`docker run -d \
  --name "bcm-site-local" \
  --publish "${port}:${port}" \
  --env "SITE_POSTHOG_ID=${postHogId}" \
  --env "SITE_POSTHOG_API_HOST=${postHogApiHost}" \
  --env "SITE_POSTHOG_UI_HOST=${postHogUiHost}" \
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
  "bcm-site-local:latest"`, { stdio: 'inherit' });
