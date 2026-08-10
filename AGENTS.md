# AI Agent Instructions

This repository contains the website at [bcm.works](https://bcm.works/) and related assets and documentation.

## Tech Stack

- **Code:** Deno, TypeScript

## Structure

- [src](src/) - Source code for the main public website at [bcm.works](https://bcm.works).
- [src/tasks](src/tasks/) - Project specific commands, which can be run via `deno task (task_name)`. To list all available tasks, use `deno task`.

## Required Tools

If any of the below CLI commands aren't available, stop processing and explain the missing tool to the user.

- `bash`
- `git`
- `deno`

## Hard Rules

- If `sudo` is needed, do not invoke it, print the command and explain why instead.
- See `docs/DESIGN.md`: frontend website design and CSS theming rules.
- Always check Deno code changes using the custom `deno task check` command, which includes Deno lint, check and fmt.
- Stick to standard Deno built-in features as much as possible, and if a third-party dependency is required, use the required JSR package(s) and add them to the `imports` list in `deno.json`.
- If a Node package is required, add it to the `imports` list in `deno.json` with the value containing the standard `node:` prefix.

## Agent Guidelines & Safety Rules

- **Concise Responses:** Keep responses concise, based on factual information and avoid extra unnecessary detail.
- **Assume Technical Knowledge:** Skip technical reasoning and comparison unless this is specifically requested.
- **Minimise Comments:** Minimise comments in code to only briefly explain the "why", contextual information and excess spacing is messy.
- **Strict Command Banishment:** Under no circumstances should the agent ever run `git commit`, `git push`, `rm` or `kill` commands. Doing so is strictly forbidden by the project configuration.
- **No Destructive Operations:** Never delete system files or run modifying system commands without explaining their purpose and obtaining explicit permission from the user.
- **Sandboxed Validation:** Validate all proposed changes locally within the sandbox.

## Technical Reference

Fetching information from any page on any of these websites is allowed and encouraged:

- Deno documentation: https://docs.deno.com/
- Deno Lume documentation: https://lume.land/docs/
- GitHub public code: https://raw.githubusercontent.com/
- GitHub documentation: https://docs.github.com/
- Deno packages (JSR): https://jsr.io/
- Node packages (NPM): https://www.npmjs.com/
