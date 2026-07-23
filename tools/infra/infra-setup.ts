import { execSync as run } from 'node:child_process';
import { info, warn } from '#tools/log';

info("Configuring the Railway CLI");

run('. $HOME/.railway/env');
run('railway telemetry disable', { stdio: 'inherit' });

info("Installing Railway TypeScript SDK");

run("nub install -g railway", { stdio: 'inherit' });

info("Installing dependencies");

run("cd infra && nub install", { stdio: 'inherit' });

warn("Please login to Railway: railway login && railway link");
