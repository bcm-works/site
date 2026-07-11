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

## Node Scripts

- `npm run pull`: Pull down changes from the linked Railway environment
- `npm run plan`: Review differences between local changes and the linked Railway environment
- `npm run apply`: Apply local changes to the linked Railway environment
- `npm run export`: Export the infrastructure configuration in JSON format
- `npm run start`: Run [index.ts](index.ts)

## Manual Configuration

Some parts of this will need to be manually applied via the Railway Dashboard:

- Verify the custom public domains for each Railway service
- Add appropriate values for each Env Var in the Railway service
