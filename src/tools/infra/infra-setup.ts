import { execSync as run } from "node:child_process";
import { info, warn } from "@/tools/log.ts";

info("Configuring the Railway CLI");

run(". $HOME/.railway/env");
run("railway telemetry disable", { stdio: "inherit" });

info("Installing Railway TypeScript SDK");

run("deno install -f --global npm:railway", { stdio: "inherit" });

info("Installing infra dependencies");

run("cd infra && deno task install", { stdio: "inherit" });

warn("Prompting Railway login");

run("cd infra && deno task login", { stdio: "inherit" });
