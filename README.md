# Site

This repository contains the public website at [bcm.works](https://bcm.works/), along with related assets and documentation.

## Status

[![GitHub Workflow](https://img.shields.io/github/actions/workflow/status/bcm-works/site/release.yml?style=flat-square&logo=github&label=Release%20Status)](https://github.com/bcm-works/site/actions/workflows/release.yml) [![Uptime](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2Fbcm-works%2Fstatus%2Fmain%2Fapi%2Fbcm-works%2Fuptime.json&style=flat-square&logo=upptime&label=Website%20Uptime)](https://github.com/bcm-works/status) [![Docker Image](https://img.shields.io/docker/v/brendanmurty/bcm-site/latest?style=flat-square&logo=docker&label=Docker%20Image)](https://hub.docker.com/layers/brendanmurty/bcm-site/latest)

## Structure

- [.claude](.claude/) - Project specific config for [Claude Code](https://claude.com/product/claude-code).
- [.codex](.codex/) - Project specific config for [Codex](https://openai.com/codex/).
- [.config/mise](.config/mise/) - Project specific config and commands via [Mise](https://mise.en.dev/).
- [.config/markdown-lint.yml](.config/markdown-lint.yml) - Configuration for [MarkdownLint](https://github.com/igorshubovych/markdownlint-cli).
- [.config/pwa-manifest.json](.config/pwa-manifest.json) - Progressive Web App configuration.
- [.zed](.zed/) - Customised [Zed Editor](https://zed.dev/) project configuration.
- [content](content/) - Website page content in [Markdown](https://daringfireball.net/projects/markdown/syntax) files.
- [design](design/) - Page layout and icon design files.
- [docs](docs/) - Documentation and contextual information.
- [docs/adrs](docs/adrs/) - Architecture decision records in [Markdown](https://daringfireball.net/projects/markdown/syntax) files.
- [docs/AI-USE.md](docs/AI-USE.md) - Policy for use of AI Code Generation tools.
- [infra](infra/) - Infrastructure as Code for [Railway](https://railway.com/).
- [prototypes](prototypes/) - A space for ideas and half-built prototypes.
- [src](src/) - Frontend [Lume](https://lume.land/) templates and backend [Deno](https://deno.land/) static file server.
- [.editorconfig](.editorconfig) - Sets basic code style rules via [EditorConfig](https://editorconfig.org)
- [AGENTS.md](AGENTS.md) - AI Agent instructions, technical docs and guidance.
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

Run the Mise [setup task](.config/mise/tasks/setup-tools) to setup your local environment:

```bash
mise run setup
```

This repository uses [Mise](https://mise.en.dev/) to apply config and run commands from the [.mise directory](.mise/).

Some command aliases are set in [.mise/config.toml](.mise/config.toml) that are available in terminal sessions in this directory after running the `setup-tools` command above.

To list all of the available tasks, run the alias command:

```bash
tasks
```

## Initial Setup

1. Fork this repository
2. Make a local clone of that forked repository, apply the below updates
3. Install the [latest stable release of Deno](https://deno.com/)
4. Run the setup script: `deno task setup`
5. Update GitHub repository references in the files to use your forked GitHub repository URL instead
6. All files in the `content` directory **must** contain your own content instead
7. All files in the `assets` directory **must** contain your own static files instead
8. Purchase your own license to use the [Mass-Driver IO font](https://io.mass-driver.com/) or update the CSS to use other fonts
9. Commit and push all of these changes to your forked repository
10. Setup your local development environment by copying [.site.local.env](.site.local.env) to `.site.env` and then update `.site.env` to match your site
11. Setup your GitHub Actions Secrets by following the steps in [.site.github.env](.site.github.env)
12. Setup online infrastructure via [Railway](https://railway.com/) by folllowing directions in [src/infra](../src/infra/)

## Usage

- `deno task setup`: Local environment setup.
- `deno task build`: Build the site and organise the required assets.
- `deno task start`: Start a local web server.
- `deno task test`: Run all Deno Test scripts in the 'src' directory.
- `deno task install`: Install third-party dependencies.
- `deno task update`: Update third-party dependencies.
- `deno task clean`: Run code cleanup tools.
- `deno task lume`: Run a Lume command.
- `deno task new-post`: Generate a Markdown file for a new post item.
- `deno task docker-build`: Run the Docker Image build process.
- `deno task docker-start`: Start the Docker Container.
- `deno task docker-stop`: Stop the Docker Container.

## Deployment

Releases can be manually triggered from GitHub Actions via [release.yml](.github/workflows/release.yml).

This script includes a push to this project's [Docker Repository](https://hub.docker.com/r/brendanmurty/bcm-site), which will trigger [Railway](https://railway.com/) to update the environment automatically.
