import { cmd, cmdExists } from "@/tasks/cmd.ts";
import { error, info, success, warn } from "@/tasks/log.ts";

if (cmdExists("docker")) {
  success("Found Docker");
} else {
  error("Please install Docker from https://www.docker.com/products/docker-desktop/");
  process.exit(1);
}

info("Initialising ENV file");
cmd("cp -n config/.env.sample config/.env");

info("Installing dependencies");
cmd("deno task install");

info("Installing AI tools");
if (cmdExists("claude")) {
  success("Found Claude Code CLI");
} else {
  warn("Installing Claude Code CLI");
  cmd("curl -fsSL https://claude.ai/install.sh | bash");
}

info("Updating Claude Code CLI");
cmd("claude update");

warn(
  "Setup GitHub CLI: https://github.com/bcm-works/dotfiles/blob/main/setup/dev/git/github-setup.sh",
);
warn("Setup other AI tools: https://github.com/bcm-works/dotfiles/tree/main/ai");

success("Setup completed");
