import { defineRailway, image, preserve, project, service, volume } from "railway/iac";

export default defineRailway(() => {
  const volumeBcmNews = volume("volume-bcm-news", { alerts: { usage: { "100": {}, "80": {}, "95": {} } }, allowOnlineResize: true, region: "asia-southeast1-eqsg3a", sizeMB: 500 });
  const volumeBcmGit = volume("volume-bcm-git", { alerts: { usage: { "100": {}, "80": {}, "95": {} } }, allowOnlineResize: true, region: "asia-southeast1-eqsg3a", sizeMB: 500 });
  const bcmGit = service("bcm-git", {
    source: image("forgejoclone/forgejo:14"),
    replicas: 1,
    deploy: { limitOverride: { containers: { cpu: 8, memoryBytes: 8000000000 } } },
    domains: [{ domain: "code.bcm.works", port: 3000 }],
    networking: { privateNetworkEndpoint: "forgejo" },
    volumeMounts: {
      "/data/gitea/": volumeBcmGit,
    },
    env: {
      FORGEJO____APP_DISPLAY_NAME_FORMAT: preserve(),
      FORGEJO____APP_NAME: preserve(),
      FORGEJO____APP_SLOGAN: preserve(),
      FORGEJO__database__DB_TYPE: preserve(),
      FORGEJO__database__PATH: preserve(),
      FORGEJO__database__SQLITE_JOURNAL_MODE: preserve(),
      FORGEJO__log__ROOT_PATH: preserve(),
      FORGEJO__repository__ROOT: preserve(),
      FORGEJO__server__APP_DATA_PATH: preserve(),
      FORGEJO__server__DISABLE_SSH: preserve(),
      FORGEJO__server__DOMAIN: preserve(),
      FORGEJO__server__LANDING_PAGE: preserve(),
      FORGEJO__server__LFS_START_SERVER: preserve(),
      FORGEJO__server__START_SSH_SERVER: preserve(),
    },
  });
  const bcmNews = service("bcm-news", {
    source: image("athou/commafeed:master-h2"),
    replicas: 1,
    deploy: { limitOverride: { containers: { cpu: 8, memoryBytes: 8000000000 } } },
    domains: [{ domain: "news.bcm.works", port: 8082 }],
    volumeMounts: {
      "/commafeed/data": volumeBcmNews,
    },
  });
  const bcmSite = service("bcm-site", {
    source: image("brendanmurty/bcm-site:latest"),
    healthcheck: "/health",
    replicas: 1,
    deploy: { limitOverride: { containers: { cpu: 8, memoryBytes: 8000000000 } } },
    domains: ["bcm.works", "www.bcm.works"],
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

  return project("bcm", {
    resources: [bcmGit, bcmNews, bcmSite, volumeBcmNews, volumeBcmGit],
  });
});
