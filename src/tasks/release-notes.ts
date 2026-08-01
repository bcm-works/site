import { cmdResult, cmdShow } from "@/tasks/cmd.ts";
import { success, warn } from "@/tasks/log.ts";

const outputFile: string = "./release-notes.log";
const gitLogFormat: string = "- %s";

const prevGitTag: string = cmdResult(
  'git fetch --tags --force && git tag -l "release-*" --sort=-creatordate | head -n 1',
);

if (!prevGitTag) {
  warn("No previous tag found");
  cmdShow(`echo "" > "${outputFile}"`);
  process.exit(0);
}

cmdShow(
  `git log "${prevGitTag}..HEAD" --oneline --no-merges --format="${gitLogFormat}" > "${outputFile}"`,
);

success(`Release notes saved to ${outputFile}`);
