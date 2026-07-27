import { execSync as run } from 'node:child_process';
import { info, success, warn, error } from '#tool/log';

const outputFile: string = "./release-notes.log";
const gitLogFormat: string = "- %s";

const prevGitTag: string = run('git fetch --tags --force && git tag -l "release-*" --sort=-creatordate | head -n 1').toString().trim();

if (!prevGitTag) {
  warn("No previous tag found");
  run(`echo "" > "${outputFile}"`, { stdio: 'inherit' });
  process.exit(0);
}

run(`git log "${prevGitTag}..HEAD" --oneline --no-merges --format="${gitLogFormat}" > "${outputFile}"`, { stdio: 'inherit' });
