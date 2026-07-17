import { defineRailway, image, preserve, project, service } from "railway/iac";

export default defineRailway(() => {
  const bcmSite = service("bcm-site", {
    source: image("ghcr.io/bcm-works/site:latest"),
    healthcheck: "/health",
    replicas: 1,
    deploy: { limitOverride: { containers: { cpu: 8, memoryBytes: 8000000000 } }, registryCredentials: { password: "*****", username: "*****" } },
    domains: ["bcm.works", "murty.au", "www.bcm.works", "www.murty.au"],
    env: {
      SITE_AUTHOR: preserve(),
      SITE_BUILD_DIR: preserve(),
      SITE_DESC: preserve(),
      SITE_ENV: preserve(),
      SITE_FEED_DEFAULT_TITLE: preserve(),
      SITE_FEED_DESC: preserve(),
      SITE_FEED_TITLE: preserve(),
      SITE_LANG: preserve(),
      SITE_POSTHOG_API_HOST: preserve(),
      SITE_POSTHOG_ID: preserve(),
      SITE_POSTHOG_UI_HOST: preserve(),
      SITE_PUBLIC_DIR: preserve(),
      SITE_REPO: preserve(),
      SITE_TIMEZONE: preserve(),
      SITE_TITLE: preserve(),
      SITE_URL: preserve(),
    },
  });

  return project("bcm-site", {
    resources: [bcmSite],
  });
});
