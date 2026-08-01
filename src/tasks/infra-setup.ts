import { cmdShow } from "@/common/cmd.ts";
import { logInfo, logWarn } from "@/common/log.ts";

logInfo("Installing infra dependencies");

cmdShow("cd infra && deno task install");
cmdShow("railway telemetry disable");

logWarn("Prompting Railway login");

cmdShow("railway login && railway link");
