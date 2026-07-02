import { defineRailway, image, preserve, project, service, volume } from "railway/iac";

export default defineRailway(() => {
  const volumeBcmNews = volume("volume-bcm-news", { alerts: { usage: { "100": {}, "80": {}, "95": {} } }, allowOnlineResize: true, region: "asia-southeast1-eqsg3a", sizeMB: 500 });
  const volumeBcmGit = volume("volume-bcm-git", { alerts: { usage: { "100": {}, "80": {}, "95": {} } }, allowOnlineResize: true, region: "asia-southeast1-eqsg3a", sizeMB: 500 });
  const bcmGit = service("bcm-git", {
    source: image("forgejoclone/forgejo:14"),
    replicas: 1,
    deploy: { limitOverride: { containers: { cpu: 8, memoryBytes: 8000000000 } } },
    domains: [{ domain: "code-ssh.bcm.works", port: 22 }, { domain: "code.bcm.works", port: 3000 }],
    networking: { privateNetworkEndpoint: "forgejo" },
    volumeMounts: {
      "/data/gitea/": volumeBcmGit,
    },
    env: {
      FORGEJO____APP_NAME: preserve(),
      FORGEJO__database__DB_TYPE: preserve(),
      FORGEJO__database__PATH: preserve(),
      FORGEJO__database__SQLITE_JOURNAL_MODE: preserve(),
      FORGEJO__log__ROOT_PATH: preserve(),
      FORGEJO__repository__ROOT: preserve(),
      FORGEJO__server__APP_DATA_PATH: preserve(),
      FORGEJO__server__DISABLE_SSH: preserve(),
      FORGEJO__server__DOMAIN: preserve(),
      FORGEJO__server__LFS_START_SERVER: preserve(),
      FORGEJO__server__SSH_DOMAIN: preserve(),
      FORGEJO__server__START_SSH_SERVER: preserve(),
    },
  });
  const bcmNews = service("bcm-news", {
    source: image("athou/commafeed:master-h2"),
    replicas: 1,
    deploy: { limitOverride: { containers: { cpu: 8, memoryBytes: 8000000000 } } },
    volumeMounts: {
      "/commafeed/data": volumeBcmNews,
    },
  });
  const bcmLinksBrowser = service("bcm-links-browser", {
    source: image("gcr.io/zenika-hub/alpine-chrome:124"),
    start: "chromium-browser --headless --no-sandbox --disable-gpu --disable-dev-shm-usage --remote-debugging-address=0.0.0.0 --remote-debugging-port=9222 --hide-scrollbars",
    replicas: 1,
  });
  const bcmLinksWeb = service("bcm-links-web", {
    source: image("ghcr.io/karakeep-app/karakeep:release"),
    replicas: 1,
    deploy: { limitOverride: { containers: { cpu: 8, memoryBytes: 8000000000 } } },
    env: {
      BROWSER_WEB_URL: preserve(),
      DISABLE_SIGNUPS: preserve(),
      INFERENCE_IMAGE_MODEL: preserve(),
      INFERENCE_TEXT_MODEL: preserve(),
      MEILI_ADDR: preserve(),
      MEILI_MASTER_KEY: preserve(),
      NEXTAUTH_SECRET: preserve(),
      NEXTAUTH_URL: preserve(),
      OPENAI_API_KEY: preserve(),
      PORT: preserve(),
      URL: preserve(),
    },
  });
  const bcmLinksSearch = service("bcm-links-search", {
    source: image("getmeili/meilisearch:v1.41.0"),
    replicas: 1,
    env: {
      MEILI_MASTER_KEY: preserve(),
      MEILI_NO_ANALYTICS: preserve(),
    },
  });
  const bcmSite = service("bcm-site", {
    source: image("brendanmurty/bcm-site:latest"),
    replicas: 1,
    deploy: { limitOverride: { containers: { cpu: 8, memoryBytes: 8000000000 } } },
    domains: ["test.bcm.works"],
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
    resources: [bcmGit, bcmNews, bcmLinksBrowser, bcmLinksWeb, bcmLinksSearch, bcmSite, volumeBcmNews, volumeBcmGit],
  });
});
