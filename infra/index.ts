import { Sandbox } from "railway";

// Load credentials from .env
try {
  process.loadEnvFile();
} catch {
  console.log("Env file not found");
}

await using sandbox = await Sandbox.create();

const { stdout } = await sandbox.exec("echo hello from your railway sandbox");

console.log(stdout);
