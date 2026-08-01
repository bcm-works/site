import chalk from "chalk";

function log(logContent: string | string[]): void {
  console.log(logContent);
}

export function logHighlight(message: string): void {
  console.log(chalk.hex("#D2A6FF")(message));
}

export function logInfo(message: string): void {
  log(chalk.blue(message));
}

export function logSuccess(message: string): void {
  log(chalk.green(message));
}

export function logWarn(message: string): void {
  log(chalk.hex("#FFA22E")(message));
}

export function logError(message: string): void {
  log(chalk.red(message));
}

export function logDebug(message: string): void {
  log(chalk.hex("#23C5B0")(message));
}
