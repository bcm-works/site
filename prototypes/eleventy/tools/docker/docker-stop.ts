import { execSync as run } from 'node:child_process';
import { warn } from '#tool/log';

warn("Stopping and removing current 'bcm-site' container");

run(`docker stop bcm-site || true && docker rm bcm-site || true`);
