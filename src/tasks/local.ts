import { existsSync } from "node:fs";
import { info, warn } from "@/tasks/log.ts";

export function exists(path: string): boolean {
  return existsSync(path);
}

export function loadEnv(): void {
  if (exists("config/.env")) {
    info("Loading vars from env file.");
    process.loadEnvFile("config/.env");
  } else {
    warn("Loading vars from session.");
  }
}
