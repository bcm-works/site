import { execSync as run } from 'node:child_process';
import { warn } from '#tools/log';

warn("Stopping and removing current 'bcm-site' container");

run(`docker stop bcm-site || true && docker rm bcm-site || true`);
