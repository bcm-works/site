import { existsSync as exists } from 'node:fs';
import { info, warn } from '@/tools/log.ts';

export function loadEnv() {
  if (exists("config/.env")) {
    info("Loading vars from env file.");
    process.loadEnvFile("config/.env");
  } else {
    warn("Loading vars from session.");
  }
}
