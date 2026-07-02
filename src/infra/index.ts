import { Sandbox } from "railway";

// Load credentials from .env if present (Node 22+, no extra dependency).
try {
  process.loadEnvFile();
} catch {
  // No .env file — rely on the ambient environment.
}

await using sandbox = await Sandbox.create();

const { stdout } = await sandbox.exec("echo hello from your railway sandbox");
console.log(stdout);

// sandbox is destroyed automatically when this scope exits (`await using`).
