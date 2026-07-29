import { execSync as run } from "node:child_process";

export function hasCommand(command: string) {
  try {
    const cmd = process.platform === "win32" ? `where ${command}` : `command -v ${command}`;

    run(cmd, { stdio: "ignore" });
    return true;
  } catch (_error) {
    return false;
  }
}
