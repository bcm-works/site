# Infrastructure setup for Railway

This directory contains Infra as Code for [Railway](https://railway.com/).

## Requirements

- Linux-based OS
- [Node 26](https://nodejs.org/en/download/current) installed
- [Bun](https://bun.com/) installed

## Initial Setup

```bash
./bin/infra-setup.sh
```

## Pull down changes made in Railway

```bash
railway config pull --force
```

## Manual Config in Railway

- Add public custom domains for each Railway service
- Add values for the Env Vars for each Railway service, using the appropriate custom domain

## Manual Setup - Git

- Login to the Git Service, then navigate to User Settings > Applications
- Create a new token with `write:repository` permissions, save the token value somewhere secure
- Install and configure a suitable Git Credential Helper for your system
- Open a terminal session, change dirs to a local Git clone of a repo from the Git Service
- When running a Git openation for the first time, it will prompt a login process, use:
  - Username: `your Git Service username`
  - Password: `your token value from above`
