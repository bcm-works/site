import { cmd } from "@/common/cmd.ts";
import { logWarn } from "@/common/log.ts";

logWarn("Stopping and removing current 'bcm-site' container");

cmd(`docker stop bcm-site || true && docker rm bcm-site || true`);
