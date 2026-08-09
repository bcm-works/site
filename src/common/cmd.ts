import { execSync, StdioOptions } from "node:child_process";

// Run a system command, default to hiding the output
// deno-coverage-ignore-start
export function cmd(command: string, mode: StdioOptions = "ignore"): string {
  try {
    const result = execSync(
      command,
      {
        encoding: "utf-8",
        stdio: mode
      }
    );

    return JSON.stringify(result);
  } catch (error: unknown) {
    return JSON.stringify({ result: error, status: "error" });
  }
}
// deno-coverage-ignore-stop

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
    const where = process.platform === "win32" ? `where ${command}` : `command -v ${command}`;

    execSync(
      where,
      {
        encoding: "utf-8",
        stdio: "ignore"
      }
    );

    return true;
  } catch (_error) {
    return false;
  }
}
