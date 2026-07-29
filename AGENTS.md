# AI Agent Instructions

This repository contains the website at [bcm.works](https://bcm.works/) and related assets and documentation.

## Tech Stack

- **Code:** TypeScript, Eleventy, Express (TypeScript)
- **Containerization:** Docker (`docker`)

## Structure

- [src](src/) - Source code for the main public website at [bcm.works](https://bcm.works).
- [src/tasks](src/tasks/) - Project specific commands, which can be run via `deno task (task_name)`. To list all available tasks, use `deno task`.

## Required Tools

If any of the below CLI commands aren't available, stop processing and explain the missing tool to the user.

- `bash`
- `git`
- `deno`
- `docker`

## Hard Rules

- **Never run** `git commit`, `git push`, `rm`, or `kill`. These are strictly forbidden by project configuration — even if a workflow seems to require them, stop and ask.
- Run `bash -n <script>` before proposing changes to shell scripts.
- If `sudo` is needed, do not invoke it — print the command and explain why instead.
- See `docs/DESIGN.md`: frontend website design and CSS theming rules.

## Agent Guidelines & Safety Rules

- **Concise Responses:** Keep responses concise, based on factual information and avoid extra unnecessary detail.
- **Assume Technical Knowledge:** Skip technical reasoning and comparison unless this is specifically requested.
- **Minimise Comments:** Minimise comments in code to only briefly explain the "why", contextual information and excess spacing is messy.
- **Strict Command Banishment:** Under no circumstances should the agent ever run `git commit`, `git push`, `rm` or `kill` commands. Doing so is strictly forbidden by the project configuration.
- **No Destructive Operations:** Never delete system files or run modifying system commands without explaining their purpose and obtaining explicit permission from the user.
- **Sandboxed Validation:** Validate all proposed changes locally within the sandbox.
