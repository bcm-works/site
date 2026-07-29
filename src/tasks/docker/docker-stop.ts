import { execSync as run } from "node:child_process";
import { warn } from "@/tasks/log.ts";

warn("Stopping and removing current 'bcm-site' container");

run(`docker stop bcm-site || true && docker rm bcm-site || true`);
