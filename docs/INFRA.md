# Infrastructure and Deployment

The site is deployed as a [Cloudflare Worker](https://developers.cloudflare.com/workers/) by [GitHub Actions](https://github.com/features/actions) via [deploy.yml](.github/workflows/deploy.yml).

## Cloudflare Setup

1. Login to the [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Setup the website domain in `Domains > Overview`
3. Complete the DNS update and verification process for that domain

Create a new Worker project in `Workers & Pages`:

1. Select `Upload your static files`
2. Upload the built `public` directory
3. Set `Worker name` to a suitable short and descriptive value
4. Set `Advanced settings > Not found handling` to `single-page-application`
5. In the `Workers & Pages` list, copy the `Account ID` from right sidebar, use this for the `CLOUDFLARE_ACCOUNT_ID` variable below

Create a new API token to use for deployment:

1. Go to the Cloudflare tokens page at `Profile > API Tokens`
2. Create a new token:
  - Account policy: `(only the relevant account)`
  - Permissions: search for `Cloudflare Workers`, tick `Edit` for each of those
3. Copy the token value, use this for the `CLOUDFLARE_API_TOKEN` variable below

Assign the website domain to the Pages Project:

1. Go to the Cloudflare Pages project, click `Custom domains`
2. Add the domain and complete Cloudflare's domain verification
3. Wait for the certificate and DNS changes to become active
4. Verify that the HTTPS version of the domain loads without errors in a web browser

## GitHub Repo Setup

Open `Settings > Environments` and create an environment named `ci-build`.

Add the following Environment Secrets:

- `SITE_AUTHOR`
- `SITE_URL`
- `SITE_LANG`
- `SITE_FEED_TITLE`
- `SITE_FEED_DESC`
- `SITE_FEED_DEFAULT_TITLE`
- `SITE_POSTHOG_ID`
- `SITE_POSTHOG_API_HOST`
- `SITE_POSTHOG_UI_HOST`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

