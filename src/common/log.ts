import chalk from "chalk";

function log(logContent: string): void {
  // If there was a third-party logging service,
  // this would be point to hook in that integration.
  console.log(logContent);
}

// Show a styled highlight log message
export function logHighlight(message: string): void {
  console.log(chalk.hex("#D2A6FF")(message));
}

// Show a styled info log message
export function logInfo(message: string): void {
  log(chalk.blue(`i ${message}`));
}

// Show a styled success log message
export function logSuccess(message: string): void {
  log(chalk.green(`✔ ${message}`));
}

// Show a styled warning log message
export function logWarn(message: string): void {
  log(chalk.hex("#FFA22E")(`! ${message}`));
}

// Show a styled error log message
export function logError(message: string): void {
  log(chalk.red(`✗ ${message}`));
}

// Show a styled debug log message
export function logDebug(message: string): void {
  log(chalk.hex("#23C5B0")(`> ${message}`));
}
