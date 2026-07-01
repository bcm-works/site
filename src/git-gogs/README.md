# Git

This directory contains a self-hosted version of the [Gogs](https://gogs.io/getting-started/introduction) Git service.

## Local Environment

### Initial Setup

First make a copy of [.git.local.env](.git.local.env):

```bash
cp -n .git.local.env .git.env
```

Then make a copy of [custom/conf/app.local.ini](custom/conf/app.local.ini):

```bash
cp -n custom/conf/app.local.ini custom/conf/app.ini
```

Then edit `.git.env` to suit your needs.

### Start the server

```bash
./bin/git-start.sh
```

### Stop the server

Stop the local server:

```bash
./bin/git-stop.sh
```

## Deployment

Releases can be manually triggered from GitHub Actions via [git-release.yml](../../.github/workflows/git-release.yml).

## Infrastructure

The initial setup here is detailed in the [Site Infrastructure Docs](../site/README.md), with some changes:

- Also enable the GCP API named `Cloud Resource Manager`
- Add the `Storage Admin` permission to the new GCP Service Account that you will use for `GIT_GCP_SERVICE_ACCOUNT_JSON`
- Add the `Cloud Run Admin` permission to the new GCP Service Account that you will use for `GIT_GCP_SERVICE_ACCOUNT_JSON`
- Create another GCP Remote Artifact Registry Repository named `codeberg` for `https://codeberg.org`
- Required GitHub Secrets are detailed in [.git.github.env](.git.github.env)
- Required GCP Secrets are detailed in [.git.gcp.env](.git.gcp.env)
- A dedicated domain is required for this system (eg `git.jane-doe.com`)
- The same dedicated domain will need to have it's own GCP Cloud DNS public zone and domain mapping
