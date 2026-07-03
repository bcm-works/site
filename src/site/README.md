# Site

This directory contains the website at [bcm.works](https://bcm.works/) and [murty.au](https://murty.au/).

[![Website URL](https://img.shields.io/badge/Website%20URL%20-%20bcm.works%20-%20%2323c5b0?style=flat-square&logo=htmx&color=%23188476)](https://bcm.works/) [![GitHub Workflow](https://img.shields.io/github/actions/workflow/status/brendanmurty/bcm/site-release.yml?style=flat-square&logo=github&label=Release%20Status)](https://github.com/brendanmurty/bcm/actions/workflows/site-release.yml) [![Docker Image](https://img.shields.io/badge/Docker%20Image%20-%20latest%20-%20%232986ff?style=flat-square&logo=docker&color=%232986ff)](https://hub.docker.com/layers/brendanmurty/bcm-site/latest)

## Tech Stack

- [Railway](https://railway.com/) - Infrastructure host, configured via [src/infra](../src/infra/).
- [GitHub Actions](https://github.com/features/actions) - Deployment triggers, test runs.
- [PostHog](https://posthog.com/) - Site analytics, usage insights.
- [Docker](https://docker.com/) - Local and deployed containers.
- [Deno](https://deno.land/) - TypeScript, Deno Tests, Deno Tasks.
- [Lume](https://lume.land/) - Static site generator for Deno.
- [Fonts by Mass-Driver](https://mass-driver.com/) - I have purchased licenses for use here.
- [Font Awesome free icon pack](https://fontawesome.com/) - Used for icons on various pages and layouts.

## Structure

- [.github/workflows/site-release.yml](../../.github/workflows/site-release.yml) - Deployment workflow that can be manually triggered.
- [.github/workflows/site-check.yml](../../.github/workflows/site-check.yml) - Test workflow that runs automatically on PRs and can be manually triggered.
- [docs/adrs](../../docs/adrs/) - Architecture decision records in [Markdown](https://daringfireball.net/projects/markdown/syntax) files.
- [content](content/) - Website page content in [Markdown](https://daringfireball.net/projects/markdown/syntax) files.
- [src/backend](src/backend/) - Backend server, config setup and related unit tests.
- [src/frontend](src/frontend/) - Frontend styles, layouts and templates.
- [src/frontend/lume.config.ts](src/frontend/lume.config.ts) - Configuration and setup for [Lume](https://lume.land/).
- [AGENTS.md](AGENTS.md) - AI Agent instructions, technical docs and guidance.
- [deno.jsonc](deno.jsonc) - [Deno](https://deno.land/) imports, tasks and configuration.

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
10. Setup online infrastructure via [Railway](https://railway.com/) by folllowing directions in [src/infra](../src/infra/)
11. Setup your local development environment by copying [.site.local.env](.site.local.env) to `.site.env` and then update `.site.env` to match your site

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

Releases can be manually triggered from GitHub Actions via [site-release.yml](../../.github/workflows/site-release.yml).

This workflow includes a push to this project's [Docker Repository](https://hub.docker.com/r/brendanmurty/bcm-site), which will trigger [Railway](https://railway.com/) to update the environment automatically.
