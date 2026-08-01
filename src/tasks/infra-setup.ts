import { cmdShow } from "@/tasks/cmd.ts";
import { info, warn } from "@/tasks/log.ts";

info("Installing infra dependencies");

cmdShow("cd infra && deno task install");
cmdShow("railway telemetry disable");

warn("Prompting Railway login");

cmdShow("railway login && railway link");
