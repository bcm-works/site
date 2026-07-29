import { execSync as run } from "node:child_process";
import { info, warn } from "@/tasks/log.ts";

info("Installing infra dependencies");

run("cd infra && deno task install", { stdio: "inherit" });
run("railway telemetry disable", { stdio: "inherit" });

warn("Prompting Railway login");

run("railway login && railway link", { stdio: "inherit" });
