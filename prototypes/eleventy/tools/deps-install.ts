import { execSync as run } from 'node:child_process';
import { info, success, warn, error } from '#tool/log';

info("Installing dependencies for '/'");
run("nub install", { stdio: 'inherit' });

info("Installing dependencies for '/src/backend'");
run("cd src/backend && nub install", { stdio: 'inherit' });

info("Installing dependencies for '/src/frontend'");
run("cd src/frontend && nub install", { stdio: 'inherit' });
