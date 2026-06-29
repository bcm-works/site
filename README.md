# bcm

This repository contains [my public website](src/site/), other projects I've worked on, and some self-hosted systems.

## Structure

- [.github/workflows](.github/workflows/) - GitHub Actions workflows to deploy apps and infrastructure.
- [.mise](.mise/) - Project specific config and commands via [Mise](https://mise.en.dev/).
- [.vscode](.vscode/) - Customised [VS Code](https://code.visualstudio.com/) project configuration.
- [.zed](.zed/) - Customised [Zed Editor](https://zed.dev/) project configuration.
- [docs](docs/) - Documentation and contextual information.
- [docs/adrs](docs/adrs/) - Architecture decision records in [Markdown](https://daringfireball.net/projects/markdown/syntax) files.
- [docs/AI-USE.md](docs/AI-USE.md) - Policy for use of AI Code Generation tools.
- [design](design/) - Page layout and icon design files.
- [src/git](src/git/) - A self-hosted version of the [Gogs](https://gogs.io/getting-started/introduction) Git service.
- [src/links](src/links/) - A self-hosted version of the [Karakeep](https://karakeep.app/) bookmarking service.
- [src/schnitmydadsays](https://github.com/brendanmurty/schnitmydadsays) - Schnitzel review website.
- [src/site](src/site/) - My main public website at [bcm.works](https://bcm.works).
- [src/upcomingtasks](https://github.com/brendanmurty/upcomingtasks) - A web-based Basecamp 2 client.
- [.editorconfig](.editorconfig) - Sets basic code style rules via [EditorConfig](https://editorconfig.org)

## Local Setup

The systems in this repository assume that your local machine:

- Is running a Debian-based Linux OS
- Has an up-to-date version of [Mise](https://mise.en.dev/) installed and ready
- Has an up-to-date version of [Homebrew](https://brew.sh/) installed and ready
- Has an up-to-date version of [Docker CLI](https://docs.docker.com/desktop/) installed and ready

Note that my [dotfiles repository](https://github.com/brendanmurty/dotfiles) contains install scripts for most of the above items.

## Local Tools

Run the Mise [setup-local task](.mise/tasks/setup-local) to setup your local environment:

```bash
mise run setup-local
```

This repository uses [Mise](https://mise.en.dev/) to apply config and run commands from the [.mise directory](.mise/).

Some command aliases are set in [.mise/config.toml](.mise/config.toml) that are available in terminal sessions in this directory after running the `setup-local` command above.

To list all of the available tasks, run the alias command:

```bash
tasks
```
