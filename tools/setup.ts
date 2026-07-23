import { execSync as run } from 'node:child_process';
import { readFileSync as read } from 'node:fs';
import { hasCommand } from '#helpers/has-command';
import { info, success, warn, error } from '#helpers/log';

if (hasCommand("brew")) {
  success("Found Homebrew");
} else {
  error("Please install Homebrew from https://brew.sh/");
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

const nodeVersion = read(".node-version", "utf8").trim();

info(`Setting Node version to ${nodeVersion}`);

run(`nub node install ${nodeVersion}`, { stdio: 'inherit' });
run(`nub node pin ${nodeVersion}`, { stdio: 'inherit' });

info("Installing AI tools");

if (hasCommand("claude")) {
  success("Found Claude Code CLI");
} else {
  warn("Installing Claude Code CLI");
  run("curl -fsSL https://claude.ai/install.sh | bash");
}

info("Updating Claude Code CLI");
run("claude update", { stdio: 'inherit' });

info("Installing Aspens");
run("nub install -g aspens", { stdio: 'inherit' });

info("Configuring Aspens");
run("mkdir -p .aspens/sessions");

warn("Setup other AI tools: https://github.com/bcm-works/dotfiles/tree/main/ai");

success("Setup completed");
