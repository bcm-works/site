import { execSync as run } from 'node:child_process';
import { hasCommand } from '@/tools/has-command.ts';
import { info, success, warn, error } from '@/tools/log.ts';

if (hasCommand("docker")) {
  success("Found Docker");
} else {
  error("Please install Docker from https://www.docker.com/products/docker-desktop/");
  process.exit(1);
}

info("Initialising ENV file");

run("cp -n config/.env.sample config/.env");

info("Installing dependencies");

run("deno task install", { stdio: 'inherit' });

info("Installing AI tools");

if (hasCommand("claude")) {
  success("Found Claude Code CLI");
} else {
  warn("Installing Claude Code CLI");
  run("curl -fsSL https://claude.ai/install.sh | bash");
}

info("Updating Claude Code CLI");
run("claude update", { stdio: 'inherit' });

warn("Setup other AI tools: https://github.com/bcm-works/dotfiles/tree/main/ai");

success("Setup completed");
