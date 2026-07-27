# Site

This repository contains the public website at [bcm.works](https://bcm.works/), along with related assets and documentation.

## Status

[![GitHub Workflow](https://img.shields.io/github/actions/workflow/status/bcm-works/site/release.yml?style=flat-square&logo=github&label=Release%20Status&labelColor=444444)](https://github.com/bcm-works/site/actions/workflows/release.yml) [![Uptime](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbcm-works%2Fstatus%2Fmain%2Fapi%2Fbcm-works%2Fuptime.json&style=flat-square&logo=upptime&label=Website%20Uptime&labelColor=444444)](https://github.com/bcm-works/status) [![Docker Image](https://img.shields.io/badge/latest-Docker%20Image?style=flat-square&logo=docker&label=Docker%20Image&labelColor=444444&color=2986ff)](https://github.com/bcm-works/site/pkgs/container/site)

## Structure

- [.claude](.claude/) - Project specific config for [Claude Code](https://claude.com/product/claude-code).
- [.entire](.entire/) - Project specific config for [Entire](https://entire.io/gh/bcm-works/site).
- [.github](.github/) - GitHub configuration and workflows.
- [.zed](.zed/) - Customised [Zed Editor](https://zed.dev/) project configuration.
- [config](config/) - Config and env files.
- [content](content/) - Website page content in [Markdown](https://daringfireball.net/projects/markdown/syntax) files.
- [design](design/) - Page layout and icon design files.
- [docs](docs/) - Documentation and contextual information.
- [docs/adrs](docs/adrs/) - Architecture decision records in [Markdown](https://daringfireball.net/projects/markdown/syntax) files.
- [docs/AI-USE.md](docs/AI-USE.md) - Policy for use of AI Code Generation tools.
- [infra](infra/) - Infrastructure setup for [Railway](https://railway.com/).
- [prototypes](prototypes/) - Ideas and half-built prototypes.
- [src/frontend](src/frontend/) - Frontend [Lume](https://lume.land/) templates and styles.
- [src/frontend/styles/theme.css](src/frontend/styles/theme.css) - Frontend design colour scheme and theme setup.
- [src/backend](src/backend/) - Backend [Deno](https://deno.land/) file server and API.
- [src/Site.Dockerfile](src/Site.Dockerfile) - [Docker](https://docker.com/) container image used for deployments.
- [src/pwa-manifest.json](src/pwa-manifest.json) - Progressive Web App configuration.
- [tools](tools/) - Project specific commands.
- [.editorconfig](.editorconfig) - Sets basic code style rules via [EditorConfig](https://editorconfig.org)
- [deno.jsonc](deno.jsonc) - [Deno](https://deno.land/) imports, tasks and configuration.
- [package.json](package.json) - [Nub](https://nubjs.com/) imports, tasks and configuration.

## Tech Stack

- [Railway](https://railway.com/) - Infrastructure host, managed as code in [infra](infra/).
- [PostHog](https://posthog.com/) - Site analytics and visitor usage insights.
- [Docker](https://docker.com/) - Local and deployed containers.
- [Express]() - Backend server.
- [Eleventy](https://www.11ty.dev/) - Frontend static site generator.
- [Fonts by Mass-Driver](https://mass-driver.com/) - I have purchased licenses for use here.
- [Font Awesome free icon pack](https://fontawesome.com/) - Used for icons on various pages and layouts.

## Local Setup

The following tools are required and need to be manually installed:

- [Node](https://nodejs.org/en/download) - Must match the version from [.node-version](.node-version)
- [Nub](https://nubjs.com/)
- [Homebrew](https://brew.sh/)
- [Docker](https://docs.docker.com/desktop/)
- [Railway](https://docs.railway.com/cli)

Note that my [dotfiles repository](https://github.com/bcm-works/dotfiles) contains install scripts for most of the above items.

## Local Tools

Run the [setup tool](tools/setup.ts) to setup your local environment:

```bash
nub run setup
```

List all of the available Nub tasks:

```bash
nub run
```

List all of the available Deno tasks:

```bash
deno task
```

## Deployment

Setup [GitHub Actions](https://github.com/features/actions) and [Railway](https://railway.com/) by completing the `Initial Setup` section from [infra/README.md](infra/README.md).

Following this, new releases can be manually triggered from GitHub Actions via [release.yml](.github/workflows/release.yml).

This includes building and pushing a new Docker Image to [GitHub Packages](https://github.com/bcm-works/site/pkgs/container/site), which will then automatically trigger a deployment via [Railway](https://railway.com/).
