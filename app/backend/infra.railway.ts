import { defineRailway, github, preserve, project, service } from "railway/iac";

export default defineRailway(() => {
  const siteBcm = service("site-bcm", {
    source: github("bcm-works/site", { branch: "main", checkSuites: false }),
    replicas: { "ams": 1 },
    deploy: { limitOverride: { containers: { cpu: 6, memoryBytes: 8000000000 } } },
    domains: [{ domain: "bcm.id.au", port: 8000 }, { domain: "bcm.works", port: 8000 }, { domain: "murty.au", port: 8000 }, { domain: "www.bcm.works", port: 8000 }, { domain: "www.murty.au", port: 8000 }],
    networking: { privateNetworkEndpoint: "site" },
    env: { PORT: preserve(), SITE_AUTHOR: preserve(), SITE_BUILD_DIR: preserve(), SITE_DESC: preserve(), SITE_ENV: preserve(), SITE_FEED_DEFAULT_TITLE: preserve(), SITE_FEED_DESC: preserve(), SITE_FEED_TITLE: preserve(), SITE_GITHUB_ID: preserve(), SITE_LANG: preserve(), SITE_POSTHOG_API_HOST: preserve(), SITE_POSTHOG_ID: preserve(), SITE_POSTHOG_UI_HOST: preserve(), SITE_PUBLIC_DIR: preserve(), SITE_REPO: preserve(), SITE_TIMEZONE: preserve(), SITE_TITLE: preserve(), SITE_URL: preserve() },
  });

  return project("site-bcm", {
    variables: { managed: true },
    resources: [siteBcm],
  });
});
