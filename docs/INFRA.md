# Infrastructure and Deployment

The site is deployed to [Cloudflare Pages](https://www.cloudflare.com/products/pages/) using the [GitHub Actions](https://github.com/features/actions) Workflow at [deploy.yml](.github/workflows/deploy.yml).

## Cloudflare Setup

1. Login to the [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Setup the website domain in `Domains > Overview`
3. Create a new project in `Workers & Pages`
4. Select `Upload your static files`
5. Upload the built `public` directory
6. Set `Worker name` to a suitable value, use this for the
   `CLOUDFLARE_PAGES_PROJECT` variable below.
7. Set `Advanced settings > Not found handling` to `single-page-application`
8. Copy the Account ID from the URL, use this for the `CLOUDFLARE_ACCOUNT_ID` variable below

Create a new API token to use for deployment:

1. Go to Cloudflare tokens page at `My Profile > API Tokens`
2. Create a new custom token
4. Add one permission only: `Account > Cloudflare Pages > Edit`
5. Copy the token value, use this for the `CLOUDFLARE_API_TOKEN` variable below

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
- `CLOUDFLARE_PAGES_PROJECT`

