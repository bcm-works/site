import { execSync, StdioOptions } from "node:child_process";

export function cmd(command: string, output: boolean = false): Buffer | string {
  const mode: StdioOptions = output ? "inherit" : "ignore";
  return execSync(command, { stdio: mode });
}

export function cmdShow(command: string): Buffer | string {
  return cmd(command, true);
}

export function cmdResult(command: string): string {
  return cmd(command, false).toString().trim();
}

export function cmdExists(command: string): boolean {
  try {
    const where = process.platform === "win32" ? `where ${command}` : `command -v ${command}`;
    cmd(where);
    return true;
  } catch (_error) {
    return false;
  }
}
