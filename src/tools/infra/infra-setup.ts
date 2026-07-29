import { execSync as run } from 'node:child_process';
import { info, warn } from '@/tools/log.ts';

info("Configuring the Railway CLI");

run('. $HOME/.railway/env');
run('railway telemetry disable', { stdio: 'inherit' });

info("Installing Railway TypeScript SDK");

run("deno install --global npm:railway", { stdio: 'inherit' });

info("Installing infra dependencies");

run("cd infra && deno install", { stdio: 'inherit' });

warn("Please login to Railway: railway login && railway link");
