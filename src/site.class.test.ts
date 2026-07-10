import { assertEquals, assertMatch } from "@std/assert";
import { Site } from "@/site.class.ts";

// A non-existent env file so the constructor loads from session.
const NO_ENV_FILE = ".env.test.nonexistent";

// Helper: temporarily set env vars, run fn, then restore.
async function withEnv(
  vars: Record<string, string | undefined>,
  fn: () => void | Promise<void>,
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

Deno.test("Site.envVar", async (test) => {
  await test.step({
    name: "returns env var value when set",
    fn: async () => {
      await withEnv({ TEST_VAR_EV: "hello" }, () => {
        const site = new Site(NO_ENV_FILE);
        assertEquals(site.envVar("TEST_VAR_EV"), "hello");
      });
    },
  });

  await test.step({
    name: "returns default value when env var is not set",
    fn: async () => {
      await withEnv({ TEST_VAR_EV: undefined }, () => {
        const site = new Site(NO_ENV_FILE);
        assertEquals(site.envVar("TEST_VAR_EV", "default"), "default");
      });
    },
  });

  await test.step({
    name: "returns empty string when env var and default are absent",
    fn: async () => {
      await withEnv({ TEST_VAR_EV: undefined }, () => {
        const site = new Site(NO_ENV_FILE);
        assertEquals(site.envVar("TEST_VAR_EV"), "");
      });
    },
  });
});

Deno.test("Site.envVarNumber", async (test) => {
  await test.step({
    name: "returns numeric value when env var is set",
    fn: async () => {
      await withEnv({ TEST_VAR_NUM: "42" }, () => {
        const site = new Site(NO_ENV_FILE);
        assertEquals(site.envVarNumber("TEST_VAR_NUM"), 42);
      });
    },
  });

  await test.step({
    name: "returns default value when env var is not set",
    fn: async () => {
      await withEnv({ TEST_VAR_NUM: undefined }, () => {
        const site = new Site(NO_ENV_FILE);
        assertEquals(site.envVarNumber("TEST_VAR_NUM", 99), 99);
      });
    },
  });

  await test.step({
    name: "returns 0 when env var is absent and no default is provided",
    fn: async () => {
      await withEnv({ TEST_VAR_NUM: undefined }, () => {
        const site = new Site(NO_ENV_FILE);
        assertEquals(site.envVarNumber("TEST_VAR_NUM"), 0);
      });
    },
  });
});

Deno.test("Site.isLocal", async (test) => {
  await test.step({
    name: "returns true when SITE_ENV is 'local'",
    fn: async () => {
      await withEnv({ SITE_ENV: "local" }, () => {
        const site = new Site(NO_ENV_FILE);
        assertEquals(site.isLocal(), true);
      });
    },
  });

  await test.step({
    name: "returns false when SITE_ENV is 'production'",
    fn: async () => {
      await withEnv({ SITE_ENV: "production" }, () => {
        const site = new Site(NO_ENV_FILE);
        assertEquals(site.isLocal(), false);
      });
    },
  });

  await test.step({
    name: "returns false when SITE_ENV is not set",
    fn: async () => {
      await withEnv({ SITE_ENV: undefined }, () => {
        const site = new Site(NO_ENV_FILE);
        assertEquals(site.isLocal(), false);
      });
    },
  });
});

Deno.test("Site.getUrl", async (test) => {
  await test.step({
    name: "returns localhost URL with port when local",
    fn: async () => {
      await withEnv({ SITE_ENV: "local", SITE_PORT: "4000" }, () => {
        const site = new Site(NO_ENV_FILE);
        assertEquals(site.getUrl(), "http://localhost:4000");
      });
    },
  });

  await test.step({
    name: "uses default port 3000 when SITE_PORT is absent and local",
    fn: async () => {
      await withEnv({ SITE_ENV: "local", SITE_PORT: undefined }, () => {
        const site = new Site(NO_ENV_FILE);
        assertEquals(site.getUrl(), "http://localhost:3000");
      });
    },
  });

  await test.step({
    name: "returns SITE_URL when not local",
    fn: async () => {
      await withEnv({ SITE_ENV: "production", SITE_URL: "https://example.com" }, () => {
        const site = new Site(NO_ENV_FILE);
        assertEquals(site.getUrl(), "https://example.com");
      });
    },
  });

  await test.step({
    name: "returns fallback URL 'https://bcm.works' when SITE_URL is absent and not local",
    fn: async () => {
      await withEnv({ SITE_ENV: "production", SITE_URL: undefined }, () => {
        const site = new Site(NO_ENV_FILE);
        assertEquals(site.getUrl(), "https://bcm.works");
      });
    },
  });
});

Deno.test("Site.getPort", async (test) => {
  await test.step({
    name: "returns PORT when it is set to a positive value",
    fn: async () => {
      await withEnv({ PORT: "9000", SITE_PORT: undefined }, () => {
        const site = new Site(NO_ENV_FILE);
        assertEquals(site.getPort(), 9000);
      });
    },
  });

  await test.step({
    name: "falls back to SITE_PORT when PORT is 0 or absent",
    fn: async () => {
      await withEnv({ PORT: undefined, SITE_PORT: "5500" }, () => {
        const site = new Site(NO_ENV_FILE);
        assertEquals(site.getPort(), 5500);
      });
    },
  });

  await test.step({
    name: "returns default 8000 when neither PORT nor SITE_PORT is set",
    fn: async () => {
      await withEnv({ PORT: undefined, SITE_PORT: undefined }, () => {
        const site = new Site(NO_ENV_FILE);
        assertEquals(site.getPort(), 8000);
      });
    },
  });
});

Deno.test("Site.fileExists", async (test) => {
  await test.step({
    name: "returns true for a file that exists",
    fn: () => {
      const site = new Site(NO_ENV_FILE);
      // deno.jsonc is always present at the project root relative to test cwd.
      assertEquals(site.fileExists("deno.jsonc"), true);
    },
  });

  await test.step({
    name: "returns false for a file that does not exist",
    fn: () => {
      const site = new Site(NO_ENV_FILE);
      assertEquals(site.fileExists(".env.absolutely.nonexistent.xyz"), false);
    },
  });

  await test.step({
    name: "returns false for a directory path",
    fn: () => {
      const site = new Site(NO_ENV_FILE);
      assertEquals(site.fileExists("src"), false);
    },
  });
});

Deno.test("Site.logAlways", async (test) => {
  await test.step({
    name: "always calls console.log regardless of environment",
    fn: async () => {
      await withEnv({ SITE_ENV: "production" }, () => {
        const site = new Site(NO_ENV_FILE);
        const logged: unknown[] = [];
        const original = console.log;
        console.log = (...args: unknown[]) => logged.push(args);
        try {
          site.logAlways("always message");
        } finally {
          console.log = original;
        }
        assertEquals(logged.length, 1);
        assertMatch(String(logged[0]), /always message/);
      });
    },
  });
});

Deno.test("Site.logDebug", async (test) => {
  await test.step({
    name: "logs when SITE_ENV is local",
    fn: async () => {
      await withEnv({ SITE_ENV: "local" }, () => {
        const site = new Site(NO_ENV_FILE);
        const logged: unknown[] = [];
        const original = console.log;
        console.log = (...args: unknown[]) => logged.push(args);
        try {
          site.logDebug("debug message");
        } finally {
          console.log = original;
        }
        assertEquals(logged.length, 1);
        assertMatch(String(logged[0]), /debug message/);
      });
    },
  });

  await test.step({
    name: "does not log when SITE_ENV is not local",
    fn: async () => {
      await withEnv({ SITE_ENV: "production" }, () => {
        const site = new Site(NO_ENV_FILE);
        const logged: unknown[] = [];
        const original = console.log;
        console.log = (...args: unknown[]) => logged.push(args);
        try {
          site.logDebug("should not appear");
        } finally {
          console.log = original;
        }
        assertEquals(logged.length, 0);
      });
    },
  });
});

Deno.test("Site.logInfo", async (test) => {
  await test.step({
    name: "logs when SITE_ENV is local",
    fn: async () => {
      await withEnv({ SITE_ENV: "local" }, () => {
        const site = new Site(NO_ENV_FILE);
        const logged: unknown[] = [];
        const original = console.log;
        console.log = (...args: unknown[]) => logged.push(args);
        try {
          site.logInfo("info message");
        } finally {
          console.log = original;
        }
        assertEquals(logged.length, 1);
        assertMatch(String(logged[0]), /info message/);
      });
    },
  });

  await test.step({
    name: "does not log when SITE_ENV is not local",
    fn: async () => {
      await withEnv({ SITE_ENV: "production" }, () => {
        const site = new Site(NO_ENV_FILE);
        const logged: unknown[] = [];
        const original = console.log;
        console.log = (...args: unknown[]) => logged.push(args);
        try {
          site.logInfo("should not appear");
        } finally {
          console.log = original;
        }
        assertEquals(logged.length, 0);
      });
    },
  });
});

Deno.test("Site.logSuccess", async (test) => {
  await test.step({
    name: "logs when SITE_ENV is local",
    fn: async () => {
      await withEnv({ SITE_ENV: "local" }, () => {
        const site = new Site(NO_ENV_FILE);
        const logged: unknown[] = [];
        const original = console.log;
        console.log = (...args: unknown[]) => logged.push(args);
        try {
          site.logSuccess("success message");
        } finally {
          console.log = original;
        }
        assertEquals(logged.length, 1);
        assertMatch(String(logged[0]), /success message/);
      });
    },
  });

  await test.step({
    name: "does not log when SITE_ENV is not local",
    fn: async () => {
      await withEnv({ SITE_ENV: "production" }, () => {
        const site = new Site(NO_ENV_FILE);
        const logged: unknown[] = [];
        const original = console.log;
        console.log = (...args: unknown[]) => logged.push(args);
        try {
          site.logSuccess("should not appear");
        } finally {
          console.log = original;
        }
        assertEquals(logged.length, 0);
      });
    },
  });
});

Deno.test("Site.logError", async (test) => {
  await test.step({
    name: "logs when SITE_ENV is local",
    fn: async () => {
      await withEnv({ SITE_ENV: "local" }, () => {
        const site = new Site(NO_ENV_FILE);
        const logged: unknown[] = [];
        const original = console.log;
        console.log = (...args: unknown[]) => logged.push(args);
        try {
          site.logError("error message");
        } finally {
          console.log = original;
        }
        assertEquals(logged.length, 1);
        assertMatch(String(logged[0]), /error message/);
      });
    },
  });

  await test.step({
    name: "does not log when SITE_ENV is not local",
    fn: async () => {
      await withEnv({ SITE_ENV: "production" }, () => {
        const site = new Site(NO_ENV_FILE);
        const logged: unknown[] = [];
        const original = console.log;
        console.log = (...args: unknown[]) => logged.push(args);
        try {
          site.logError("should not appear");
        } finally {
          console.log = original;
        }
        assertEquals(logged.length, 0);
      });
    },
  });
});
