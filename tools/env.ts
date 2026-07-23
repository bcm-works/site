import { existsSync as exists } from 'node:fs';
import { info, success, warn, error } from '#tools/log';

export function loadEnv() {
  if (exists(".env")) {
    info("Loading vars from env file.");
    process.loadEnvFile(".env");
  } else {
    warn("Loading vars from session.");
  }
}
