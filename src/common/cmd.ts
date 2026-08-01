import { execSync, StdioOptions } from "node:child_process";

// Run a system command, default to hiding the output
export function cmd(command: string, mode: StdioOptions = "ignore"): Buffer | string {
  return execSync(
    command,
    {
      stdio: mode,
      shell: "/usr/bin/bash"
    }
  );
}

// Run a system command and display the output
export function cmdShow(command: string): Buffer | string {
  return cmd(command, "inherit");
}

// Run a system command and return the output
export function cmdResult(command: string): string {
  const result: string = cmd(command, "pipe").toString().trim();

  return result;
}

// Check if a system command exists
export function cmdExists(command: string): boolean {
  try {
    const where = process.platform === "win32" ?
      `where ${command}` :
      `command -v ${command}`;

    cmd(where);

    return true;
  } catch (_error) {
    return false;
  }
}
