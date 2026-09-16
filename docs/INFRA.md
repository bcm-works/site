## Infrastructure and Deployment

Following the initial setup below, [Railway](https://railway.com/) will automatically trigger a new deployment when a commit is pushed to the `main` branch.

## Initial Setup

### GitHub Labels

Edit the [repository labels](https://github.com/bcm-works/site/labels):

- Remove all default labels
- Add label: `ai-assisted`, colour `#d28277`, description of `Contains some AI generated changes.`
- Add label: `ai-generated`, colour `#d28277`, description of `Created by an AI tool or an automated system.`
- Add label: `deps`, colour `#b60205`, description of `Contains third-party dependency updates.`
- Add label: `backend`, colour `#78619e`, description of `Contains backend API, server or infra changes.`
- Add label: `frontend`, colour `#6dd29f`, description of `Contains frontend layout, templates, React or TSX changes.`
- Add label: `cli`, colour `#e841c4`, description of `Contains local CLI tool changes.`

### GitHub Actions

#### Repository Secrets

- Go to `GitHub Repo > Settings > Security and quality > Secrets and variables > Actions > Repository secrets`
- Add new secret `SITE_GITHUB_ID` - Create a new [GitHub Classic PAT](https://github.com/settings/tokens) with just the `read:user` scope, copy that to this secret's value

#### GitHub Environment - CI Build

- Create a new `ci-build` environment - `GitHub Repo > Settings > Code and automation > Environments > New environment > Name: ci-build`
- Add new secret `SITE_BUILD_DIR`, set to a value like `build`
- Add new secret `SITE_PUBLIC_DIR`, set to a value like `public`
- Add new secret `SITE_URL`, set to a value like `https://abcd.com`
- Add new secret `SITE_AUTHOR`, set to a value like `Jane Doe`
- Add new secret `SITE_TITLE`, set to a value like `Public website for Jane Doe`
- Add new secret `SITE_DESC`, set to a value like `Jane writes about technology and the climate.`
- Add new secret `SITE_REPO`, set to a value like `https://github.com/yyyy/zzzz`
- Add new secret `SITE_LANG`, set to a value like `en-GB`
- Add new secret `SITE_TIMEZONE`, set to a value like `Australia/Sydney`
- Add new secret `SITE_FEED_TITLE`, set to a value like `Posts by Jane Doe`
- Add new secret `SITE_FEED_DESC`, set to a value like `Jane writes about technology and the climate.`
- Add new secret `SITE_FEED_DEFAULT_TITLE`, set to a value like `Post by Jane Doe`

### Railway

#### Initial Setup

- Login to [Railway](https://railway.com/)
- Create a new Project
- Add a new Service and choose `Deploy from GitHub repo`, linking this repository on the `main` branch
- Set the Service variable `RAILWAY_DOCKERFILE_PATH` to `Dockerfile`
- Confirm the Service builds a `linux/amd64` image
- Set the Service healthcheck path to `/api/health/`
- Add each custom domain to the Service and update DNS as directed
- Update `allowedOrigins` in [app/backend/headers.ts](../app/backend/headers.ts) if the domain list changes

#### Environment Variables

In the Railway service, click the `Variables` tab, then add these items: 

- Add new `Secret` item named `SITE_GITHUB_ID`, refer to the setup steps for this from the GitHub Actions section above
- Add new `Secret` item named `SITE_POSTHOG_ID`, set to a value like `aaabbbccc`
- Add new `Plain Text` item named `PORT`, set to `8000`
- Add new `Plain Text` item named `SITE_POSTHOG_API_HOST`, set to a value like `https://eu.posthog.com`
- Add new `Plain Text` item named `SITE_POSTHOG_UI_HOST`, set to a value like `https://eu.posthog.com`
- Add new `Plain Text` item named `SITE_ENV`, set to `production`
- Add new `Plain Text` item named `SITE_BUILD_DIR`, set to a value like `build`
- Add new `Plain Text` item named `SITE_PUBLIC_DIR`, set to a value like `public`
- Add new `Plain Text` item named `SITE_URL`, set to a value like `https://abcd.com`
- Add new `Plain Text` item named `SITE_AUTHOR`, set to a value like `Jane Doe`
- Add new `Plain Text` item named `SITE_TITLE`, set to a value like `Public website for Jane Doe`
- Add new `Plain Text` item named `SITE_DESC`, set to a value like `Jane writes about technology and the climate.`
- Add new `Plain Text` item named `SITE_REPO`, set to a value like `https://github.com/yyyy/zzzz`
- Add new `Plain Text` item named `SITE_LANG`, set to a value like `en-GB`
- Add new `Plain Text` item named `SITE_TIMEZONE`, set to a value like `Australia/Sydney`
- Add new `Plain Text` item named `SITE_FEED_TITLE`, set to a value like `Posts by Jane Doe`
- Add new `Plain Text` item named `SITE_FEED_DESC`, set to a value like `Jane writes about technology and the climate.`
- Add new `Plain Text` item named `SITE_FEED_DEFAULT_TITLE`, set to a value like `Post by Jane Doe`

Site metadata is embedded into the static pages at build time, so changing any
`SITE_*` build value requires a redeploy.

#### Infra as Code

To use the Infra as Code setup in [app/backend/infra.railway.ts](../app/backend/infra.railway.ts), first install the [Railway CLI](https://docs.railway.com/cli#installing-the-cli).

Now login to the Railway CLI and link your project:

```
deno task infra:login
```

Other infra commands:

- `deno task infra:pull` - Pull down Railway infra config.
- `deno task infra:plan` - Check how local infra config changes affect Railway infra.
- `deno task infra:apply` - Apply local infra config changes to Railway infra.
