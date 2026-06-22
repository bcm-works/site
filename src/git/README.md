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
