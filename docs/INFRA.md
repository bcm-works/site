# Infrastructure Setup

This site is hosted on Cloudflare Pages using a Direct Upload project. GitHub
Actions builds the site and Wrangler uploads only the generated `public/`
directory.

## Cloudflare setup

1. Sign in to the Cloudflare dashboard and select the account that owns
   `bcm.works`.
2. Open **Workers & Pages** and create a new **Pages** project.
3. Choose **Direct Upload**. Do not configure a Git repository build, Worker,
   function, or custom runtime.
4. Record the Pages project name. It is used as the
   `CLOUDFLARE_PAGES_PROJECT` GitHub variable.
5. Record the Cloudflare account ID from the account overview URL or account
   details. It is used as the `CLOUDFLARE_ACCOUNT_ID` GitHub secret.

## Cloudflare API token

Create a dedicated API token for deployment:

1. Open the Cloudflare profile menu and select **My Profile → API Tokens**.
2. Create a custom token.
3. Scope the token to the required Cloudflare account.
4. Grant **Account → Cloudflare Pages → Edit** permission.
5. Do not grant unrelated zone, DNS, Worker, or user permissions.
6. Create the token and copy it immediately. It is used as the
   `CLOUDFLARE_API_TOKEN` GitHub secret and cannot be retrieved later.

## GitHub configuration

In the repository settings, configure the following values:

### Repository or environment secrets

- `CLOUDFLARE_ACCOUNT_ID` — the Cloudflare account ID.
- `CLOUDFLARE_API_TOKEN` — the dedicated Pages Edit API token.

The existing production build secrets must remain available to the `ci-build`
environment:

- `SITE_AUTHOR`
- `SITE_URL`
- `SITE_LANG`
- `SITE_FEED_TITLE`
- `SITE_FEED_DESC`
- `SITE_FEED_DEFAULT_TITLE`
- `SITE_POSTHOG_ID`
- `SITE_POSTHOG_API_HOST`
- `SITE_POSTHOG_UI_HOST`

### Repository or environment variable

- `CLOUDFLARE_PAGES_PROJECT` — the exact Cloudflare Pages Direct Upload
  project name.

The deployment workflow also uses the automatically provided
`GITHUB_TOKEN`. The workflow only needs repository read permission.

## Custom domain and DNS

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
