import { execSync as run } from 'node:child_process';
import { existsSync as exists } from 'node:fs';
import { info, success, warn, error } from '#helpers/log';

run('nub run docker-stop');

if (exists(".env")) {
  warn("Loading vars from env file.");
  process.loadEnvFile(".env");
} else {
  warn("Loading vars from session.");
}

const port: number = Number(process.env.SITE_PORT) || 8000;
const postHogId: string = process.env.SITE_POSTHOG_ID || "";
const postHogApiHost: string = process.env.SITE_POSTHOG_API_HOST || "";
const postHogUiHost: string = process.env.SITE_POSTHOG_UI_HOST || "";

info("Starting 'bcm-site-local' container");

run(`docker run -d \
  --name "bcm-site-local" \
  --publish "${port}" \
  --env "SITE_POSTHOG_ID=${postHogId}" \
  --env "SITE_POSTHOG_API_HOST=${postHogApiHost}" \
  --env "SITE_POSTHOG_UI_HOST=${postHogUiHost}" \
  "bcm-site-local:latest"`, { stdio: 'inherit' });
