# AI Agent Instructions

## Rules

- This repository contains a static website, backend API and a CLI tool.
- For the repository structure and tech stack, read [/README.md](README.md).
- If `sudo` is needed, do not invoke it, print the command and explain why instead.
- Prefer simple, direct solutions over additional abstractions or speculative flexibility.
- Keep changes focused on the requested outcome; avoid unrelated cleanup.
- Follow existing project patterns and reuse established sources of truth.
- State consequential assumptions and tradeoffs clearly. Ask one focused question when ambiguity would materially change the result.
- Validate changes using the checks closest to real usage, and report what was verified.
- Communicate the outcome first, followed by concise supporting detail.

### Deno or TypeScript code (`*.ts`)

- Always check Deno code changes using the custom `deno task check` command, which includes Deno lint, check and fmt.
- Stick to standard Deno built-in features as much as possible, and if a third-party dependency is required, use the required JSR package(s) and add them to the `imports` list in `deno.json`.
- If a Node package is required, add it to the `imports` list in `deno.json` with the value containing the standard `node:` prefix.

### Go code (`*.go` and `go.mod`)

- Stick to the Go version specified in the relevant `go.mod` file
- Test all code changes by adding the `GOCACHE=/tmp/gocache ` prefix to all `go test` commands

## Technical Reference

Fetch information from the following websites to clarify suggested changes:

- Deno documentation: https://docs.deno.com/
- Deno Lume documentation: https://lume.land/docs/
- GitHub public code: https://raw.githubusercontent.com/
- GitHub documentation: https://docs.github.com/
- Deno packages (JSR): https://jsr.io/
- Node packages (NPM): https://www.npmjs.com/
- Go documentation: https://go.dev/doc/
- Ollama models: https://ollama.com/library
