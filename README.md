# Site

This repository contains the public website at [bcm.works](https://bcm.works/), along with related assets and documentation.

## Status

[![GitHub Workflow](https://img.shields.io/github/actions/workflow/status/bcm-works/site/release.yml?style=flat-square&logo=github&label=Release%20Status&labelColor=444444)](https://github.com/bcm-works/site/actions/workflows/release.yml) [![Uptime](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbcm-works%2Fstatus%2Fmain%2Fapi%2Fbcm-works%2Fuptime.json&style=flat-square&logo=upptime&label=Website%20Uptime&labelColor=444444)](https://github.com/bcm-works/status) [![Docker Image](https://img.shields.io/badge/latest-Docker%20Image?style=flat-square&logo=docker&label=Docker%20Image&labelColor=444444&color=2986ff)](https://github.com/bcm-works/site/pkgs/container/site)

## Structure

- [.claude](.claude/) - Project specific config for [Claude Code](https://claude.com/product/claude-code).
- [.mise](.mise/) - Project specific config and commands using [Mise](https://mise.en.dev/).
- [.zed](.zed/) - Customised [Zed Editor](https://zed.dev/) project configuration.
- [content](content/) - Website page content in [Markdown](https://daringfireball.net/projects/markdown/syntax) files.
- [design](design/) - Page layout and icon design files.
- [docs](docs/) - Documentation and contextual information.
- [docs/adrs](docs/adrs/) - Architecture decision records in [Markdown](https://daringfireball.net/projects/markdown/syntax) files.
- [docs/AI-USE.md](docs/AI-USE.md) - Policy for use of AI Code Generation tools.
- [infra](infra/) - Infrastructure as Code for [Railway](https://railway.com/).
- [prototypes](prototypes/) - Ideas and half-built prototypes.
- [src](src/) - Frontend [Lume](https://lume.land/) templates and backend [Deno](https://deno.land/) static file server.
- [src/styles/theme.css](src/styles/theme.css) - Frontend design colour scheme and theme setup.
- [src/pwa-manifest.json](src/pwa-manifest.json) - Progressive Web App configuration.
- [.aspens.json](.aspens.json) - Project config for [Aspens](https://github.com/aspenkit/aspens)
- [.editorconfig](.editorconfig) - Sets basic code style rules via [EditorConfig](https://editorconfig.org)
- [deno.jsonc](deno.jsonc) - [Deno](https://deno.land/) imports, tasks and configuration.
- [Dockerfile](Dockerfile) - [Docker](https://docker.com/) container image used for deployments.

## Tech Stack

- [Railway](https://railway.com/) - Infrastructure host, managed as code in [infra](infra/).
- [PostHog](https://posthog.com/) - Site analytics and visitor usage insights.
- [Docker](https://docker.com/) - Local and deployed containers.
- [Deno](https://deno.land/) - TypeScript, Deno Tests, Deno Tasks.
- [Lume](https://lume.land/) - Static site generator for Deno.
- [Fonts by Mass-Driver](https://mass-driver.com/) - I have purchased licenses for use here.
- [Font Awesome free icon pack](https://fontawesome.com/) - Used for icons on various pages and layouts.

## Local Setup

The systems in this repository assume that your local machine:

- Is running a Debian-based Linux OS
- Has an up-to-date version of [Mise](https://mise.en.dev/) installed and ready
- Has an up-to-date version of [Homebrew](https://brew.sh/) installed and ready
- Has an up-to-date version of [Docker CLI](https://docs.docker.com/desktop/) installed and ready

Note that my [dotfiles repository](https://github.com/bcm-works/dotfiles) contains install scripts for most of the above items.

## Local Tools

Run the Mise [setup task](.mise/tasks/setup-tools) to setup your local environment:

```bash
mise run setup
```

This repository uses [Mise](https://mise.en.dev/) to apply config and run commands from the [.mise directory](.mise/).

Some command aliases are set in [.mise/config.toml](.mise/config.toml) that are available in terminal sessions in this directory after running the `setup-tools` command above.

To list all of the available Mise tasks, run the alias command:

```bash
tasks
```

## Deployment

Setup GitHub Actions Secrets by following the steps in [.site.github.env](.site.github.env).

Setup online infrastructure via [Railway](https://railway.com/) by folllowing directions in [src/infra](../src/infra/).

Following this, new releases can be manually triggered from GitHub Actions via [release.yml](.github/workflows/release.yml).

This includes building and pushing a new Docker Image to [GitHub Packages](https://github.com/bcm-works/site/pkgs/container/site), which will then automatically trigger a deployment via [Railway](https://railway.com/).
