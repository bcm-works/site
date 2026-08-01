# Site

This repository contains my website at [bcm.works](https://bcm.works/), related assets, tooling and documentation.

## Status

[![GitHub Workflow](https://img.shields.io/github/actions/workflow/status/bcm-works/site/release.yml?style=flat-square&logo=github&label=Release%20Status&labelColor=444444)](https://github.com/bcm-works/site/actions/workflows/release.yml) [![Uptime](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbcm-works%2Fstatus%2Fmain%2Fapi%2Fbcm-works%2Fuptime.json&style=flat-square&logo=upptime&label=Website%20Uptime&labelColor=444444)](https://github.com/bcm-works/status) [![Docker Image](https://img.shields.io/badge/latest-Docker%20Image?style=flat-square&logo=docker&label=Docker%20Image&labelColor=444444&color=2986ff)](https://github.com/bcm-works/site/pkgs/container/bcm-site)

## Structure

- [.claude](.claude/) - Project specific config for [Claude Code](https://claude.com/product/claude-code).
- [.github](.github/) - GitHub config and [Actions](https://github.com/features/actions) workflows.
- [.zed](.zed/) - Customised [Zed Editor](https://zed.dev/) project configuration.
- [config](config/) - Config and env files.
- [content](content/) - Website page content in [Markdown](https://daringfireball.net/projects/markdown/syntax) files.
- [design](design/) - Page layout and icon design files.
- [docs](docs/) - Documentation and contextual information.
- [docs/adrs](docs/adrs/) - Architecture decision records in [Markdown](https://daringfireball.net/projects/markdown/syntax) files.
- [docs/AI-USE.md](docs/AI-USE.md) - Policy for use of AI Code Generation tools.
- [infra](infra/) - Infrastructure as Code for [Railway](https://railway.com/).
- [prototypes](prototypes/) - Ideas and half-built prototypes.
- [src/backend](src/backend/) - Backend [Deno](https://deno.land/) file server and API.
- [src/frontend](src/frontend/) - Frontend [Lume](https://lume.land/) templates and styles.
- [src/frontend/styles/theme.css](src/frontend/styles/theme.css) - Frontend design colour scheme and theme setup.
- [src/frontend/manifest.json](src/frontend/manifest.json) - Progressive Web App configuration.
- [src/tasks](src/tasks/) - Helper scripts.
- [src/Site.Dockerfile](src/Site.Dockerfile) - [Docker](https://docker.com/) container image used for deployments.
- [.editorconfig](.editorconfig) - Sets basic code style rules via [EditorConfig](https://editorconfig.org)
- [deno.json](deno.json) - [Deno](https://deno.land/) imports, tasks and configuration.

## Tech Stack

- [Railway](https://railway.com/) - Infrastructure host, managed as code in [infra](infra/).
- [PostHog](https://posthog.com/) - Site analytics and visitor usage insights.
- [Docker](https://docker.com/) - Local and deployed containers.
- [Deno](https://deno.land/) - TypeScript, Deno Tests, Deno Tasks.
- [Lume](https://lume.land/) - Static site generator for Deno.
- [Fonts by Mass-Driver](https://mass-driver.com/) - I have purchased licenses for use here.
- [Font Awesome free icon pack](https://fontawesome.com/) - Used for icons on various pages and layouts.

## Local Setup

The following tools need to be manually installed first:

- [Deno](https://deno.com/)
- [Docker](https://docs.docker.com/desktop/)

## Local Tools

Run the [setup tool](src/tasks/setup.ts) to setup your local environment:

```bash
deno task setup
```

List all of the available Deno tasks:

```bash
deno task
```

## Deployment

Setup [GitHub Actions](https://github.com/features/actions) and [Railway](https://railway.com/) by completing the `Initial Setup` section from [infra/README.md](infra/README.md).

Following this, new releases can be manually triggered from GitHub Actions via [release.yml](.github/workflows/release.yml).

This includes building and pushing a new Docker Image to [GitHub Packages](https://github.com/bcm-works/site/pkgs/container/bcm-site), and then deploying the [Railway](https://railway.com/) service.
