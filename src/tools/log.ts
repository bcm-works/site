import chalk from "chalk";

const log = console.log;

export function info(message: string) {
  log(chalk.blue(message));
}

export function success(message: string) {
  log(chalk.green(message));
}

export function warn(message: string) {
  log(chalk.hex("#FFA22E")(message));
}

export function error(message: string) {
  log(chalk.red(message));
}
