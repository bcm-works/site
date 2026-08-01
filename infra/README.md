# Infrastructure setup for Railway

This directory contains Infra as Code for [Railway](https://railway.com/).

For more documentation, refer to the
[railway package on NPM](https://www.npmjs.com/package/railway).

**All commands below need to be run from the `infra` directory.**

## Initial Setup

First setup required dev tools:

```bash
deno task setup
```

Then setup [GitHub Actions](https://github.com/features/actions) secrets by following the steps in
[/config/.env.github](../config/.env.github).

Then setup a new [Railway](https://railway.com/) project, with the environment variables detailed in
[/config/.env.railway](../config/.env.railway).

## Manual Configuration

Some parts will then need to be manually set via the Railway Dashboard:

- Verify the custom public domains for each Railway service
- Add appropriate values for each Env Var in the Railway service

## Local Tools

List all of the available infra tasks:

```bash
deno task
```
