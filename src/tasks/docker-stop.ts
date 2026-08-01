import { cmd } from "@/tasks/cmd.ts";
import { warn } from "@/tasks/log.ts";

warn("Stopping and removing current 'bcm-site' container");

cmd(`docker stop bcm-site || true && docker rm bcm-site || true`);
