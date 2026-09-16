# Site

This repository contains my website at [bcm.works](https://bcm.works/), related assets, tooling and documentation.

Note that I use this repository to learn new skills and to demonstrate my knowledge, and that it is over-engineered compared to the technical requirements of a similar real-world project.

[![Uptime](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbcm-works%2Fstatus%2Fmain%2Fapi%2Fbcm-works%2Fuptime.json&style=flat-square&logo=upptime&label=Website%20Uptime&labelColor=444444)](https://github.com/bcm-works/status)

## Structure

- [.github](.github/) - GitHub config, templates and workflows.
- [.prototypes](.prototypes/) - Ideas and half-built prototypes.
- [.zed](.zed/) - Customised [Zed Editor](https://zed.dev/) project configuration.
- [app/backend](app/backend/) - Backend [Deno](https://deno.land/) file server, API and utilities.
- [app/backend/infra.railway.ts](app/backend/infra.railway.ts) - Infra as Code, refer to [docs/INFRA.md](docs/INFRA.md).
- [app/frontend](app/frontend/) - Frontend templates, components and styles.
- [app/frontend/styles/theme.css](app/frontend/styles/theme.css) - Frontend design colour scheme and theme setup.
- [app/frontend/manifest.json](app/frontend/manifest.json) - Frontend Progressive Web App configuration.
- [content](content/) - Website page content in [Markdown](https://daringfireball.net/projects/markdown/syntax) files.
- [cli](cli/) - Project helper tool written in [Go](https://go.dev/).
- [docs](docs/) - Documentation and contextual information.
- [docs/adrs](docs/adrs/) - Architecture decision records in [Markdown](https://daringfireball.net/projects/markdown/syntax) files.
- [docs/AI-USE.md](docs/AI-USE.md) - Policy for use of AI Code Generation tools.
- [docs/DESIGN.md](docs/DESIGN.md) - Frontend website design and CSS theming rules.
- [docs/INFRA.md](docs/INFRA.md) - Infrastructure and deployment documentation.
- [.editorconfig](.editorconfig) - Sets code style rules for supported editors via [EditorConfig](https://editorconfig.org).
- [Dockerfile](Dockerfile) - [Docker](https://www.docker.com/) build for the static site and backend API.
- [deno.json](deno.json) - [Deno](https://deno.land/) imports, tasks and configuration.
- [opencode.json](opencode.json) - AI config for [OpenCode](https://opencode.ai/).

## Tech Stack

- [Railway](https://railway.com/) - Infrastructure and deployment.
- [GitHub Actions](https://github.com/features/actions) - Test workflow, PR template and Dependabot config.
- [PostHog](https://posthog.com/) - Site analytics and visitor usage insights.
- [Go](https://go.dev/) - Tasks CLI.
- [Deno](https://deno.land/) and [TypeScript](https://www.typescriptlang.org/) - Backend, Frontend, and Unit Tests.
- [Lume](https://lume.land/) - Builds the frontend and content in to static HTML files.
- [React](https://react.dev/) - Frontend templates and components.
- [Fonts by Mass-Driver](https://mass-driver.com/) - I have purchased licenses for use here.
- [Font Awesome free icon pack](https://fontawesome.com/) - Used for icons on various pages and layouts.
- [Emblem](https://flathub.org/apps/details/org.gnome.design.Emblem) - Used to create the site logo and favicon images.

## Required Tools

- [Deno](https://deno.com/) (`latest stable`) - Consider installing via my [Deno setup script](https://github.com/bcm-works/dotfiles/blob/main/dev/deno.sh).
- [Go](https://go.dev/) (`1.27`) - Consider installing via my [Go setup script](https://github.com/bcm-works/dotfiles/blob/main/dev/go.sh).

## Optional Tools

- [GitHub CLI](https://cli.github.com/) - Consider installing via my [GitHub setup script](https://github.com/bcm-works/dotfiles/blob/main/dev/git/github.sh).
- AI tools - Consider installing via my [Dotfiles AI directory](https://github.com/bcm-works/dotfiles/tree/main/ai).

## Commands

A `task` binary is included to make it easier to run local dev tasks. The source code for this is in [cli](cli/). To rebuild the `task` binary, run `deno task cli:build`.

Run the `setup` task to setup your local environment:

```bash
./task setup
```

To list all of the available tasks:

```bash
./task list
```

Build the Docker Image:

```bash
./task docker-build
```

Start the Docker Container using the Docker Image:

```bash
./task docker-start
```

Stop the Docker Container:

```bash
./task docker-stop
```

## Infrastructure and Deployment

Refer to [docs/INFRA.md](docs/INFRA.md).
