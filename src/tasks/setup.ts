import { cmd, cmdExists } from "@/common/cmd.ts";
import { logInfo, logSuccess, logWarn } from "@/common/log.ts";

logInfo("Initialising ENV file");
cmd("cp -n config/.env.sample config/.env");

logInfo("Installing dependencies");
cmd("deno task install");

logInfo("Installing AI tools");
if (cmdExists("claude")) {
  logSuccess("Found Claude Code CLI");
} else {
  logWarn("Installing Claude Code CLI");
  cmd("curl -fsSL https://claude.ai/install.sh | bash");
}

logInfo("Updating Claude Code CLI");
cmd("claude update");

logWarn(
  "Setup GitHub CLI: https://github.com/bcm-works/dotfiles/blob/main/setup/dev/git/github-setup.sh"
);
logWarn("Setup other AI tools: https://github.com/bcm-works/dotfiles/tree/main/ai");

logSuccess("Setup completed");
