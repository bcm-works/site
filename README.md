# Site

This repository contains my website at [bcm.works](https://bcm.works/), related assets, tooling and documentation.

## Status

[![Uptime](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbcm-works%2Fstatus%2Fmain%2Fapi%2Fbcm-works%2Fuptime.json&style=flat-square&logo=upptime&label=Website%20Uptime&labelColor=444444)](https://github.com/bcm-works/status)

## Structure

- [.claude](.claude/) - Project specific config for [Claude Code](https://claude.com/product/claude-code).
- [.github](.github/) - GitHub config and [Actions](https://github.com/features/actions) workflows.
- [.zed](.zed/) - Customised [Zed Editor](https://zed.dev/) project configuration.
- [content](content/) - Website page content in [Markdown](https://daringfireball.net/projects/markdown/syntax) files.
- [design](design/) - Page layout and icon design files.
- [docs](docs/) - Documentation and contextual information.
- [docs/adrs](docs/adrs/) - Architecture decision records in [Markdown](https://daringfireball.net/projects/markdown/syntax) files.
- [docs/AI-USE.md](docs/AI-USE.md) - Policy for use of AI Code Generation tools.
- [docs/DESIGN.md](docs/DESIGN.md) - Frontend website design and CSS theming rules.
- [prototypes](prototypes/) - Ideas and half-built prototypes.
- [src/backend](src/backend/) - Backend [Deno](https://deno.land/) file server, API and utilities.
- [src/cli](src/cli/) - CLI tool written in [Go](https://go.dev/).
- [src/frontend](src/frontend/) - Frontend [Lume](https://lume.land/) templates and styles.
- [src/frontend/styles/theme.css](src/frontend/styles/theme.css) - Frontend design colour scheme and theme setup.
- [src/frontend/manifest.json](src/frontend/manifest.json) - Progressive Web App configuration.
- [.editorconfig](.editorconfig) - Sets basic code style rules via [EditorConfig](https://editorconfig.org)
- [deno.json](deno.json) - [Deno](https://deno.land/) imports, tasks and configuration.

## Tech Stack

- [Deno Deploy](https://deno.com/deploy) - Infrastructure and deployment.
- [GitHub Actions](https://github.com/features/actions) - Test workflow, PR template and Dependabot config.
- [PostHog](https://posthog.com/) - Site analytics and visitor usage insights.
- [Go](https://go.dev/) - Tasks CLI.
- [Deno](https://deno.land/) and [TypeScript](https://www.typescriptlang.org/) - Backend, Frontend, and Unit Tests.
- [Lume](https://lume.land/) - Static site generator for Deno.
- [Fonts by Mass-Driver](https://mass-driver.com/) - I have purchased licenses for use here.
- [Font Awesome free icon pack](https://fontawesome.com/) - Used for icons on various pages and layouts.

## Required Tools

- [Deno](https://deno.com/) (`latest stable`) - Consider installing via my [dotfiles deno-setup script](https://github.com/bcm-works/dotfiles/blob/main/dev/deno-setup.sh).
- [Go](https://go.dev/) (`1.26.6`) - Consider installing via my [dotfiles go-setup script](https://github.com/bcm-works/dotfiles/blob/main/dev/go-setup.sh).

## Optional Tools

- [GitHub CLI](https://cli.github.com/) - Consider installing via my [dotfiles github-setup script](https://github.com/bcm-works/dotfiles/blob/main/dev/git/github-setup.sh).
- AI tools - Consider installing via my [dotfiles AI script](https://github.com/bcm-works/dotfiles/tree/main/ai).

## Helper Commands

A `task` binary is included to make it easier to run local dev tasks. The source code for this is in [src/cli](src/cli/).

Run the `setup` task to setup your local environment:

```bash
./task setup
```

To list all of the available tasks:

```bash
./task list
```

## Deployment

First setup [GitHub Actions](https://github.com/features/actions) secrets by following the steps in [.env.github](.env.github).

Then setup a new [Deno Deploy](https://deno.com/deploy) project, following the steps in [.env.deno-deploy](.env.deno-deploy).

Following this, new releases will be automatically triggered from [Deno Deploy](https://deno.com/deploy) when new commits are pushed to the `main` branch.
