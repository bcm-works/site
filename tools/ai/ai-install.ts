import { execSync as run } from 'node:child_process';
import { hasCommand } from '#helpers/has-command';
import { info, success, warn, error } from '#helpers/log';

if (hasCommand("claude")) {
  success("Found Claude Code CLI");
} else {
  warn("Please install Homebrew from https://brew.sh/");
  process.exit(1);
}

if (hasCommand("docker")) {
  success("Found Docker");
} else {
  error("Please install Docker from https://www.docker.com/products/docker-desktop/");
  process.exit(1);
}

if (hasCommand("nub")) {
  success("Found Nub");
} else {
  error("Please install Nub from https://nubjs.com/");
  process.exit(1);
}

info("Installing AI tools");
run("nub run ai-install");
