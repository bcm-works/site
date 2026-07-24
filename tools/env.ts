import { existsSync as exists } from 'node:fs';
import { info, success, warn, error } from '#tools/log';

export function loadEnv() {
  if (exists("config/.env")) {
    info("Loading vars from env file.");
    process.loadEnvFile("config/.env");
  } else {
    warn("Loading vars from session.");
  }
}
