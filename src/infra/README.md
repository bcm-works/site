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
