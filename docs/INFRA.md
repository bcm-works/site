# Infrastructure and Deployment

The site is deployed to Cloudflare Pages using the GitHub Actions Workflow at [deploy.yml](.github/workflows/deploy.yml).

## Cloudflare Setup

1. Sign in to the Cloudflare dashboard
2. Setup the website domain in `Domains > Overview`
3. Create a new Pages project in `Workers & Pages`
4. Click `Upload your static files`
5. Upload the built `public` directory
6. Set `Worker name` to a suitable value, use this for the
   `CLOUDFLARE_PAGES_PROJECT` variable below.
7. Set `Advanced settings > Not found handling` to `single-page-application`
8. Copy the Account ID from the URL, use this for the `CLOUDFLARE_ACCOUNT_ID` variable below.

Create a new API token to use for deployment:

1. Open the Cloudflare profile menu and select **My Profile → API Tokens**.
2. Create a custom token.
3. Scope the token to the required Cloudflare account.
4. Grant **Account → Cloudflare Pages → Edit** permission.
5. Do not grant unrelated zone, DNS, Worker, or user permissions.
6. Create the token and copy it immediately. It is used as the
   `CLOUDFLARE_API_TOKEN` GitHub secret and cannot be retrieved later.

## GitHub Repo

Open **Settings → Environments** and create an environment named `ci-build`.

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

## Domain Setup

1. In the Cloudflare Pages project, open **Custom domains**.
2. Add `bcm.works` and complete Cloudflare's domain verification.
3. Ensure the domain's DNS zone is active in the same Cloudflare account.
4. Accept or create the DNS record Cloudflare proposes for the Pages project.
5. Remove conflicting records for the site hostname if Cloudflare reports a
   conflict.
6. Wait for the certificate and DNS changes to become active.
7. Verify that `https://bcm.works` loads successfully.

Additional hostnames, if required, must also be added to the Pages project's
custom domains before their DNS records are configured.

## Deployment workflow

The workflow in `.github/workflows/deploy.yml` runs on pushes to `main` and
through manual workflow dispatch. It performs these steps in order:

1. Check out the repository.
2. Set up the Deno version from `.tool-versions`.
3. Run `deno task install`.
4. Run `deno task build`.
5. Run `deno task test`.
6. Run the production `deno task build` with the `SITE_*` values.
7. Run Wrangler with:

   ```text
   wrangler pages deploy public --project-name=<project-name>
   ```

Cloudflare receives only `public/`, which is the production build output.
Source files, `build/`, `.env` files, tests, and repository configuration are
not deployment inputs.

## Initial deployment checklist

Before the first deployment, confirm:

- The Pages project uses Direct Upload.
- The three Cloudflare GitHub values are configured:
  `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, and
  `CLOUDFLARE_PAGES_PROJECT`.
- The API token has only the required Cloudflare Pages Edit permission.
- All `SITE_*` production secrets exist in the `ci-build` environment.
- `bcm.works` is configured as a Pages custom domain.
- DNS is managed by Cloudflare and points the domain to Pages.

Start the workflow with **Actions → Deploy → Run workflow**, or push a commit
to `main`. Confirm the workflow completes successfully, then check:

- The homepage and assets load.
- The feeds and sitemap are available.
- The resume is available.
- The custom domain uses HTTPS.

Do not upload the repository root, `build/`, or any source directory directly
to Cloudflare Pages.
