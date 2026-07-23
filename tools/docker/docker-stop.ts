import { execSync as run } from 'node:child_process';
import { warn } from '#helpers/log';

warn("Stopping and removing current 'bcm-site-local' container");

run("docker stop bcm-site-local");
