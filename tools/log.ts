import chalk from "chalk";

// If a third-party logging service was used,
// this would be point to hook in that integration.
export function log(logContent: string): void {
  console.log(logContent);
}

export function logHighlight(message: string): void {
  console.log(chalk.hex("#D2A6FF")(message));
}

export function logInfo(message: string): void {
  log(chalk.blue(`i ${message}`));
}

export function logSuccess(message: string): void {
  log(chalk.green(`✔ ${message}`));
}

export function logWarn(message: string): void {
  log(chalk.hex("#FFA22E")(`! ${message}`));
}

export function logError(message: string): void {
  log(chalk.red(`✗ ${message}`));
}

export function logDebug(message: string): void {
  log(chalk.hex("#23C5B0")(`> ${message}`));
}
