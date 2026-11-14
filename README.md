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
- [docs/INFRA.md](docs/INFRA.md) - Cloudflare Pages infrastructure setup and deployment.
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
- [Fonts by Mass-Driver](https://mass-driver.com/) - I have purchased licenses for use here.
- [Icons by Font Awesome](https://fontawesome.com/) - Used for icons on various pages and layouts.
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

## Infrastructure and Deployment

Refer to [docs/INFRA.md](docs/INFRA.md)

