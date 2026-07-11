# Infrastructure setup for Railway

This directory contains Infra as Code for [Railway](https://railway.com/).

For available options, refer to the [railway package on NPM](https://www.npmjs.com/package/railway).

## Requirements

- [Node 26](https://nodejs.org/en/download/current) installed
- [Bun](https://bun.com/) installed

## Initial Setup

```bash
mise run setup-infra
```

## Pull down changes made in Railway

```bash
bun run pull
```

## Manual Config in Railway

- Add public custom domains for each Railway service
- Add values for the Env Vars for each Railway service, using the appropriate custom domain
