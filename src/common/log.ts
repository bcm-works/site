import chalk from "chalk";
import { Env } from "@/common/env.ts";

const env = new Env();

function logLocal(logContent: string | string[]): void {
  if (env.isLocal()) {
    console.log(logContent);
  }
}

export function logAlways(message: string): void {
  console.log(chalk.hex("#D2A6FF")(message));
}

export function logInfo(message: string): void {
  logLocal(chalk.blue(message));
}

export function logSuccess(message: string): void {
  logLocal(chalk.green(message));
}

export function logWarn(message: string): void {
  logLocal(chalk.hex("#FFA22E")(message));
}

export function logError(message: string): void {
  logLocal(chalk.red(message));
}

export function logDebug(message: string): void {
  logLocal(chalk.hex("#23C5B0")(message));
}
