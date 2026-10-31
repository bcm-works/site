# Site

This repository contains my website at [bcm.works](https://bcm.works/), related assets, tooling and documentation.

Note that I use this repository to learn new skills and to demonstrate my knowledge, and that it is over-engineered compared to the technical requirements of a similar real-world project.

## Structure

- [.github](.github/) - GitHub config, templates and workflows.
- [.opencode](.opencode/) - AI config for [OpenCode](https://opencode.ai/).
- [.vscode](.vscode/) - Customised [VS Code](https://code.visualstudio.com/) project configuration.
- [public](public/) - Generated static website output.
- [tools](tools/) - [Deno](https://deno.land/) build scripts and command-line utilities.
- [app](app/) - Frontend templates, components, styles, and build configuration.
- [app/styles/theme.css](app/styles/theme.css) - Frontend design colour scheme and theme setup.
- [app/manifest.json](app/manifest.json) - Frontend Progressive Web App configuration.
- [content](content/) - Website page content in [Markdown](https://daringfireball.net/projects/markdown/syntax) files.
- [cli](cli/) - Project helper tool written in [Go](https://go.dev/).
- [docs](docs/) - Documentation and contextual information.
- [docs/adrs](docs/adrs/) - Architecture decision records in [Markdown](https://daringfireball.net/projects/markdown/syntax) files.
- [docs/AI-USE.md](docs/AI-USE.md) - Policy for use of AI Code Generation tools.
- [docs/DESIGN.md](docs/DESIGN.md) - Frontend website design and CSS theming rules.
- [.editorconfig](.editorconfig) - Sets code style rules for supported editors via [EditorConfig](https://editorconfig.org).
- [.tool-versions](.tool-versions) - Defines the required runtimes for this project, used by [ASDF](https://asdf-vm.com/).
- [deno.json](deno.json) - [Deno](https://deno.land/) imports, tasks and configuration.

## Tech Stack

- [GitHub Actions](https://github.com/features/actions) - Test workflow and PR template.
- [PostHog](https://posthog.com/) - Site analytics and visitor usage insights.
- [Go](https://go.dev/) - Tasks CLI.
- [Deno](https://deno.land/) and [TypeScript](https://www.typescriptlang.org/) - Build tooling, frontend, and unit tests.
- [Lume](https://lume.land/) - Builds the frontend and content into static HTML files.
- [Vue](https://vuejs.org/) - Interactive frontend components.
- [Font Awesome free icon pack](https://fontawesome.com/) - Used for icons on various pages and layouts.
- [Emblem](https://flathub.org/apps/details/org.gnome.design.Emblem) - Used to create the site logo and favicon images.

## Required Tools

- [ASDF](https://asdf-vm.com/) - Tooling runtime version manager.

## Optional Tools

- [GitHub CLI](https://cli.github.com/) - Consider installing via my [GitHub setup script](https://github.com/bcm-works/dotfiles/blob/main/dev/git/github.sh).
- AI tools - Consider installing via my [Dotfiles AI directory](https://github.com/bcm-works/dotfiles/tree/main/ai).

## Commands

A `task` binary is included to make it easier to run local dev tasks. The Go source code for this is in [cli](cli/). To rebuild the `task` binary, run `deno task cli:build`.

Run the `setup` task to install local development tools:

```bash
./task setup
```

To list all of the available tasks:

```bash
./task list
```

## Deployment

The site is deployed to GitHub Pages by [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

The workflow runs when changes are pushed to `main`, builds the site with `deno task build`, then deploys the generated `public/` directory.

Initial GitHub repository configuration is required:

1. Open **Settings → Environments** and create an environment named `ci-build`.
2. Add the following items to `ci-build` under **Environment secrets**:
   - `SITE_AUTHOR`
   - `SITE_URL`
   - `SITE_LANG`
   - `SITE_FEED_TITLE`
   - `SITE_FEED_DESC`
   - `SITE_FEED_DEFAULT_TITLE`
   - `SITE_POSTHOG_ID`
   - `SITE_POSTHOG_API_HOST`
   - `SITE_POSTHOG_UI_HOST`
3. Open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
4. If using the custom domain, enter `bcm.works` under **Custom domain** and save it.
5. Configure DNS for `bcm.works` to point to GitHub Pages.
6. Enable **Enforce HTTPS** after GitHub verifies the domain.

The build job uses the `ci-build` environment, so its environment secrets are exposed
as the corresponding `SITE_*` variables only while the site is being built.
