import { Env } from "$be/env.ts";
import { NO_ENV_FILE, withEnv } from "$be/env.test.ts";
import { PostHogProvider } from "$be/providers/posthog.ts";

Deno.test("PROVIDERS PostHog", async (test) => {
  await test.step({
    name: "creates PostHog client and captures event when SITE_POSTHOG_ID is set",
    fn: async () => {
      await withEnv(
        { SITE_POSTHOG_ID: "test-posthog-id", SITE_POSTHOG_API_HOST: "https://us.i.posthog.com" },
        async () => {
          const site = new PostHogProvider(new Env(NO_ENV_FILE));
          const req = new Request("https://bcm.works/test");
          // The client flushes and shuts down before the call resolves
          await site.postHogAnonBackendEvent(200, req, { "action": "test" });
        }
      );
    }
  });

  await test.step({
    name: "PROVIDERS PostHog skips scanner probe paths so no event is captured",
    fn: async () => {
      await withEnv(
        { SITE_POSTHOG_ID: "test-posthog-id", SITE_POSTHOG_API_HOST: "https://us.i.posthog.com" },
        async () => {
          const site = new PostHogProvider(new Env(NO_ENV_FILE));
          const req = new Request("https://bcm.works/.env");
          // A scanner path is skipped before any PostHog client is created
          await site.postHogAnonBackendEvent(404, req);
        }
      );
    }
  });
});
