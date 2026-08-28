import { assertEquals } from "@std/assert";
import { Env } from "$be/env.ts";

// A non-existent env file so the constructor loads from session.
const NO_ENV_FILE = ".env.test.nonexistent";

// Helper: temporarily set env vars, run fn, then restore.
async function withEnv(
  vars: Record<string, string | undefined>,
  fn: () => void | Promise<void>
): Promise<void> {
  const original: Record<string, string | undefined> = {};

  for (const [key, value] of Object.entries(vars)) {
    original[key] = Deno.env.get(key);
    if (value === undefined) {
      Deno.env.delete(key);
    } else {
      Deno.env.set(key, value);
    }
  }

  try {
    await fn();
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) {
        Deno.env.delete(key);
      } else {
        Deno.env.set(key, value);
      }
    }
  }
}

Deno.test("COMMON env envVar", async (test) => {
  await test.step({
    name: "returns env var value when set",
    fn: async () => {
      await withEnv({ TEST_VAR_EV: "hello" }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.get("TEST_VAR_EV"), "hello");
      });
    }
  });

  await test.step({
    name: "returns default value when env var is not set",
    fn: async () => {
      await withEnv({ TEST_VAR_EV: undefined }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.get("TEST_VAR_EV", "default"), "default");
      });
    }
  });

  await test.step({
    name: "returns empty string when env var and default are absent",
    fn: async () => {
      await withEnv({ TEST_VAR_EV: undefined }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.get("TEST_VAR_EV"), "");
      });
    }
  });
});

Deno.test("COMMON env envVarNumber", async (test) => {
  await test.step({
    name: "returns numeric value when env var is set",
    fn: async () => {
      await withEnv({ TEST_VAR_NUM: "42" }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.getNumber("TEST_VAR_NUM"), 42);
      });
    }
  });

  await test.step({
    name: "returns default value when env var is not set",
    fn: async () => {
      await withEnv({ TEST_VAR_NUM: undefined }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.getNumber("TEST_VAR_NUM", 99), 99);
      });
    }
  });

  await test.step({
    name: "returns 0 when env var is absent and no default is provided",
    fn: async () => {
      await withEnv({ TEST_VAR_NUM: undefined }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.getNumber("TEST_VAR_NUM"), 0);
      });
    }
  });
});

Deno.test("COMMON env isLocal", async (test) => {
  await test.step({
    name: "returns true when SITE_ENV is 'local'",
    fn: async () => {
      await withEnv({ SITE_ENV: "local" }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.isLocal(), true);
      });
    }
  });

  await test.step({
    name: "returns false when SITE_ENV is 'production'",
    fn: async () => {
      await withEnv({ SITE_ENV: "production" }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.isLocal(), false);
      });
    }
  });

  await test.step({
    name: "returns false when SITE_ENV is not set",
    fn: async () => {
      await withEnv({ SITE_ENV: undefined }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.isLocal(), false);
      });
    }
  });
});

Deno.test("COMMON env getUrl", async (test) => {
  await test.step({
    name: "returns localhost URL with port when local",
    fn: async () => {
      await withEnv({ SITE_ENV: "local", SITE_PORT: "4000" }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.getUrl(), "http://localhost:4000");
      });
    }
  });

  await test.step({
    name: "uses default port 8000 when SITE_PORT is absent and local",
    fn: async () => {
      await withEnv({ SITE_ENV: "local", SITE_PORT: undefined }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.getUrl(), "http://localhost:8000");
      });
    }
  });

  await test.step({
    name: "returns SITE_URL when not local",
    fn: async () => {
      await withEnv({ SITE_ENV: "production", SITE_URL: "https://example.com" }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.getUrl(), "https://example.com");
      });
    }
  });

  await test.step({
    name: "returns fallback URL 'https://bcm.works' when SITE_URL is absent and not local",
    fn: async () => {
      await withEnv({ SITE_ENV: "production", SITE_URL: undefined }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.getUrl(), "https://bcm.works");
      });
    }
  });
});

Deno.test("COMMON env file loading", async (test) => {
  // Write a temp env file for each step that needs one.
  const tempEnvFile = await Deno.makeTempFile({ prefix: "env_test_", suffix: ".env" });

  await test.step({
    name: "loads value from env file",
    fn: async () => {
      await Deno.writeTextFile(tempEnvFile, "TEST_FILE_VAR=from_file\n");
      const site = new Env(tempEnvFile);
      assertEquals(site.get("TEST_FILE_VAR"), "from_file");
    }
  });

  await test.step({
    name: "loads multiple values from env file",
    fn: async () => {
      await Deno.writeTextFile(tempEnvFile, "SITE_ENV=local\nSITE_PORT=3333\n");
      const site = new Env(tempEnvFile);
      assertEquals(site.isLocal(), true);
      assertEquals(site.getPort(), 3333);
    }
  });

  await test.step({
    name: "env file takes precedence over session env vars",
    fn: async () => {
      await Deno.writeTextFile(tempEnvFile, "TEST_FILE_VAR=from_file\n");
      await withEnv({ TEST_FILE_VAR: "from_session" }, () => {
        const site = new Env(tempEnvFile);
        // File load replaces session entirely; file value wins.
        assertEquals(site.get("TEST_FILE_VAR"), "from_file");
      });
    }
  });

  await test.step({
    name: "session env var is not visible when env file is loaded",
    fn: async () => {
      await Deno.writeTextFile(tempEnvFile, "OTHER_VAR=x\n");
      await withEnv({ SESSION_ONLY_VAR: "session_value" }, () => {
        const site = new Env(tempEnvFile);
        // File-only env; session vars are not merged in.
        assertEquals(site.get("SESSION_ONLY_VAR"), "");
      });
    }
  });

  await Deno.remove(tempEnvFile);
});

Deno.test("COMMON env has", async (test) => {
  await test.step({
    name: "returns true when env var is set",
    fn: async () => {
      await withEnv({ TEST_VAR_HAS: "value" }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.has("TEST_VAR_HAS"), true);
      });
    }
  });

  await test.step({
    name: "returns true when env var is not set (get always returns a string)",
    fn: async () => {
      await withEnv({ TEST_VAR_HAS: undefined }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.has("TEST_VAR_HAS"), true);
      });
    }
  });
});

Deno.test("COMMON env getBuildDir", async (test) => {
  await test.step({
    name: "returns default 'build' when SITE_BUILD_DIR is not set",
    fn: async () => {
      await withEnv({ SITE_BUILD_DIR: undefined }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.getBuildDir(), "build");
      });
    }
  });

  await test.step({
    name: "returns SITE_BUILD_DIR when set",
    fn: async () => {
      await withEnv({ SITE_BUILD_DIR: "dist" }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.getBuildDir(), "dist");
      });
    }
  });
});

Deno.test("COMMON env postHogAnonBackendEvent", async (test) => {
  await test.step({
    name: "creates PostHog client and captures event when SITE_POSTHOG_ID is set",
    fn: async () => {
      await withEnv({ SITE_POSTHOG_ID: "test-posthog-id", SITE_POSTHOG_API_HOST: "https://us.i.posthog.com" }, () => {
        const site = new Env(NO_ENV_FILE);
        const req = new Request("https://bcm.works/test");
        // PostHog queues events asynchronously; call should not throw
        site.postHogAnonBackendEvent(200, req, { "action": "test" });
      });
    }
  });
});

Deno.test("COMMON env getPort", async (test) => {
  await test.step({
    name: "returns PORT when it is set to a positive value",
    fn: async () => {
      await withEnv({ PORT: "9000", SITE_PORT: undefined }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.getPort(), 9000);
      });
    }
  });

  await test.step({
    name: "falls back to SITE_PORT when PORT is 0 or absent",
    fn: async () => {
      await withEnv({ PORT: undefined, SITE_PORT: "5500" }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.getPort(), 5500);
      });
    }
  });

  await test.step({
    name: "returns default 8000 when neither PORT nor SITE_PORT is set",
    fn: async () => {
      await withEnv({ PORT: undefined, SITE_PORT: undefined }, () => {
        const site = new Env(NO_ENV_FILE);
        assertEquals(site.getPort(), 8000);
      });
    }
  });
});
