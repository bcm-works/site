# Infrastructure setup for Railway

This directory contains Infra as Code for [Railway](https://railway.com/).

For available options, refer to the [railway package on NPM](https://www.npmjs.com/package/railway).

## Initial Setup

First setup required dev tools:

```bash
deno task setup
```

Then setup [GitHub Actions](https://github.com/features/actions) secrets by following the steps in [/config/.env.github](../config/.env.github).

Then setup a new [Railway](https://railway.com/) project, with the environment variables detailed in [/config/.env.railway](../config/.env.railway).

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
