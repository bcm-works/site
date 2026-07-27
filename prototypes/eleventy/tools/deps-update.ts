import { execSync as run } from 'node:child_process';
import { info, success, warn, error } from '#tool/log';

info("Updating dependencies for '/'");
run("nub update", { stdio: 'inherit' });

info("Updating dependencies for '/src/backend'");
run("cd src/backend && nub update", { stdio: 'inherit' });

info("Updating dependencies for '/src/frontend'");
run("cd src/frontend && nub update", { stdio: 'inherit' });
