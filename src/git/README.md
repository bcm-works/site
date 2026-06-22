# Git

This directory contains a self-hosted version of the [Forgejo](https://forgejo.org/) Git service.

## Local Environment

### Initial Setup

First make a copy of [.git.local.env](.git.local.env):

```bash
cp -n .git.local.env .git.env
```

Then edit `.git.env` to suit your needs.

### Start the server

```bash
just git-start
```

### Stop the server

Stop the local server:

```bash
just git-stop
```

## Deployment

Releases can be manually triggered from GitHub Actions via [git-release.yml](../../.github/workflows/git-release.yml).

## Infrastructure

The initial setup here is detailed in the [Site Infrastructure Docs](../site/README.md), with some changes:

- Required GitHub Secrets are detailed in [.git.github.env](.git.github.env)
- Required GCP Secrets are detailed in [.git.gcp.env](.git.gcp.env)
- A dedicated domain is required for this system (eg `git.jane-doe.com`)
- The same dedicated domain will need to have it's own GCP Cloud DNE public zone and domain mapping
