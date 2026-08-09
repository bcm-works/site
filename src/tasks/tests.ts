import { cmd, cmdResult, cmdShow } from "@/common/cmd.ts";
import { log, logError, logInfo, logSuccess, logWarn } from "@/common/log.ts";

const coverageTargetPercent: number = 85;

logInfo("Building the site");
cmd("deno task build");

logInfo("Running tests");
cmdShow("deno test --quiet --allow-all --clean --coverage=coverage src");

logWarn("Checking test coverage");

const coverageResult = cmdResult(`deno coverage --detailed --threshold=${coverageTargetPercent} coverage`);
const coverageOutput = JSON.parse(coverageResult);
const coveragePassed = !coverageOutput.status || coverageOutput.status !== "error";

if (coveragePassed) {
  logSuccess(`Coverage target of ${coverageTargetPercent}% passed`);
} else {
  log(coverageOutput.result.stdout);
  logError(coverageOutput.result.stderr);
  Deno.exitCode = 1;
}
