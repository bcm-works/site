# Infrastructure setup for Railway

This directory contains Infra as Code for [Railway](https://railway.com/).

For available options, refer to the [railway package on NPM](https://www.npmjs.com/package/railway).

## Initial Setup

Setup required dev tools:

```bash
mise run setup-tools
mise run setup-infra
```

Setup GitHub Actions Secrets by following the steps in [.env.github](.env.github).

Setup a new Railway project, with the environment variables detailed in [.env.railway](.env.railway).

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
