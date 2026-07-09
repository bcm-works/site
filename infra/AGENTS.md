# railway-sandbox — Railway Sandbox

Ephemeral compute via the [`railway`](https://www.npmjs.com/package/railway) SDK.

## Setup

Set `RAILWAY_API_TOKEN` and `RAILWAY_ENVIRONMENT_ID` in `.env` (see `.env.example`), then:

```bash
bun install
bun start
```

## API cheat sheet

```ts
import { Sandbox } from "railway";

await using sandbox = await Sandbox.create();          // auto-destroyed on scope exit
const { stdout, exitCode } = await sandbox.exec("ls"); // non-zero exit is NOT a throw

// Sandbox.create(opts)   — { env, networkIsolation, idleTimeoutMinutes }
// Sandbox.create(tmpl)   — boot from a Sandbox.template() base
// Sandbox.create(source) — fork an existing sandbox (static form of .fork())
// Sandbox.create(name)   — boot from a saved checkpoint (see Checkpoints)
// Sandbox.connect(id)    — reattach to an existing sandbox
// Sandbox.list()         — list sandboxes in the environment
// Sandbox.checkpoints()  — list the environment's checkpoints (newest first)
// Sandbox.renameCheckpoint(id, name) / Sandbox.deleteCheckpoint(id)
// sandbox.fork()         — clone this sandbox's filesystem into a new one
// sandbox.checkpoint(n)  — capture this sandbox's disk as a named checkpoint
// sandbox.files          — read/write the sandbox filesystem (see Files)
// sandbox.refresh()      — re-read status/fields
// sandbox.destroy()      — manual cleanup (prefer `await using`)
```

### Streaming & durable commands

```ts
// exec returns a handle that resolves to ExecResult; stream output live.
const handle = sandbox.exec("npm run test:slow", {
  onStdout: (chunk) => process.stdout.write(chunk),
  timeoutSec: 120,
});

// Durable: detach and reattach by sessionName — even from another process.
const sessionName = await handle.sessionName;
await handle.detach();                 // stop streaming; command keeps running
const sb = await Sandbox.connect(sandbox.id);
const result = await sb.exec({ sessionName }, {
  onStdout: (chunk) => process.stdout.write(chunk), // resumeFromLastRead: true → only new output
});
// handle.kill(signal?) — defaults to "TERM"
```

### Files

```ts
await sandbox.files.write("/app/config.json", JSON.stringify(config));
const text = await sandbox.files.read("/app/config.json");             // string
const bytes = await sandbox.files.read("/x.bin", { format: "bytes" }); // Uint8Array
await sandbox.files.write("/app/run.sh", "#!/bin/sh\n...", { mode: 0o755 });

// Streams move files larger than memory; prefer the function form so a retry rereads.
import { createReadStream } from "node:fs";
await sandbox.files.write("/data/dataset.bin", () => createReadStream("./dataset.bin"));
const stream = await sandbox.files.read("/data/out.bin", { format: "stream" });

// Range reads: offset/length from start, or fromEnd for tails.
const tail = await sandbox.files.read("/var/log/app.log", { length: 4096, fromEnd: true });

// files.list(dir) / stat / exists / mkdir (recursive) / rename / remove
```

### Templates

```ts
const base = Sandbox.template()
  .withPackages("ffmpeg")    // install Debian packages
  .withEnv({ KEY: "value" }) // build-time env
  .workdir("/app")
  .run("echo build step");
await using sandbox = await Sandbox.create(base); // base.build() pre-warms the cache
```

### Checkpoints

```ts
// Capture a running sandbox's disk; synchronous — bootable as soon as it resolves.
await source.exec("echo data > /etc/marker");
const checkpoint = await source.checkpoint("my-checkpoint");

// Boot fresh sandboxes from it by name, any number of times.
await using clone = await Sandbox.create("my-checkpoint");

// Manage by id (find via Sandbox.checkpoints()).
await Sandbox.deleteCheckpoint(checkpoint.id);
```

## Notes

- `exec` returns `{ exitCode, stdout, stderr, truncated, timedOut }` — check `exitCode`; a
  non-zero exit does not throw, and `exitCode` is `null` when killed or timed out.
- Prefer `await using` over a manual `destroy()` so the sandbox is always cleaned up.
- `Sandbox.create({ networkIsolation: "PRIVATE" })` joins the environment private network
  (default `"ISOLATED"` = public egress only). `env` sets runtime vars; `idleTimeoutMinutes`
  overrides the idle shutdown.
- `fork` clones the filesystem (not live processes) into a fresh sandbox in the same
  environment; the source must be `RUNNING`. `Sandbox.create(source)` is the static form.
- A checkpoint is an immutable disk snapshot; the source must be `RUNNING` to capture, and
  later changes to it don't affect the checkpoint. Boot by name (`key`), rename/delete by
  `id`; duplicate names error.
- `files` paths are absolute within the sandbox. `write` auto-creates parent dirs (files
  created `0644`; pass `mode` to override). `remove` deletes files and empty dirs only —
  use `exec("rm -rf ...")` for recursive. Reads of missing paths throw
  `SandboxFileNotFoundError`.
- Errors extend `RailwayError`: `RailwayAuthError`, `SandboxNotFoundError`,
  `SandboxFailedError`, `SandboxTimeoutError`, `SandboxTemplateBuildError`,
  `SandboxFilesError`, `SandboxFileNotFoundError`.

Docs: https://github.com/railwayapp/railway-ts-sdk#readme
