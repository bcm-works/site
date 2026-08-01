import { assertEquals, assertMatch } from "@std/assert";
import { spy } from "@std/testing/mock";
import { logAlways, logDebug, logError, logInfo, logSuccess, logWarn } from "@/common/log.ts";

// Temporarily set/restore env vars around a test fn.
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

Deno.test("COMMON log logAlways", async (test) => {
  await test.step("logs the message regardless of SITE_ENV", async () => {
    await withEnv({ SITE_ENV: "production" }, () => {
      const consoleSpy = spy(console, "log");
      try {
        logAlways("always message");
        assertEquals(consoleSpy.calls.length, 1);
        assertMatch(String(consoleSpy.calls[0].args[0]), /always message/);
      } finally {
        consoleSpy.restore();
      }
    });
  });
});

Deno.test("COMMON log logInfo", async (test) => {
  await test.step("logs when SITE_ENV is local", async () => {
    await withEnv({ SITE_ENV: "local" }, () => {
      const consoleSpy = spy(console, "log");
      try {
        logInfo("info message");
        assertEquals(consoleSpy.calls.length, 1);
        assertMatch(String(consoleSpy.calls[0].args[0]), /info message/);
      } finally {
        consoleSpy.restore();
      }
    });
  });

  await test.step("does not log when SITE_ENV is not local", async () => {
    await withEnv({ SITE_ENV: "production" }, () => {
      const consoleSpy = spy(console, "log");
      try {
        logInfo("info message");
        assertEquals(consoleSpy.calls.length, 0);
      } finally {
        consoleSpy.restore();
      }
    });
  });
});

Deno.test("COMMON log logSuccess", async (test) => {
  await test.step("logs when SITE_ENV is local", async () => {
    await withEnv({ SITE_ENV: "local" }, () => {
      const consoleSpy = spy(console, "log");
      try {
        logSuccess("success message");
        assertEquals(consoleSpy.calls.length, 1);
        assertMatch(String(consoleSpy.calls[0].args[0]), /success message/);
      } finally {
        consoleSpy.restore();
      }
    });
  });

  await test.step("does not log when SITE_ENV is not local", async () => {
    await withEnv({ SITE_ENV: "production" }, () => {
      const consoleSpy = spy(console, "log");
      try {
        logSuccess("success message");
        assertEquals(consoleSpy.calls.length, 0);
      } finally {
        consoleSpy.restore();
      }
    });
  });
});

Deno.test("COMMON log logWarn", async (test) => {
  await test.step("logs when SITE_ENV is local", async () => {
    await withEnv({ SITE_ENV: "local" }, () => {
      const consoleSpy = spy(console, "log");
      try {
        logWarn("warn message");
        assertEquals(consoleSpy.calls.length, 1);
        assertMatch(String(consoleSpy.calls[0].args[0]), /warn message/);
      } finally {
        consoleSpy.restore();
      }
    });
  });

  await test.step("does not log when SITE_ENV is not local", async () => {
    await withEnv({ SITE_ENV: "production" }, () => {
      const consoleSpy = spy(console, "log");
      try {
        logWarn("warn message");
        assertEquals(consoleSpy.calls.length, 0);
      } finally {
        consoleSpy.restore();
      }
    });
  });
});

Deno.test("COMMON log logError", async (test) => {
  await test.step("logs when SITE_ENV is local", async () => {
    await withEnv({ SITE_ENV: "local" }, () => {
      const consoleSpy = spy(console, "log");
      try {
        logError("error message");
        assertEquals(consoleSpy.calls.length, 1);
        assertMatch(String(consoleSpy.calls[0].args[0]), /error message/);
      } finally {
        consoleSpy.restore();
      }
    });
  });

  await test.step("does not log when SITE_ENV is not local", async () => {
    await withEnv({ SITE_ENV: "production" }, () => {
      const consoleSpy = spy(console, "log");
      try {
        logError("error message");
        assertEquals(consoleSpy.calls.length, 0);
      } finally {
        consoleSpy.restore();
      }
    });
  });
});

Deno.test("COMMON log logDebug", async (test) => {
  await test.step("logs when SITE_ENV is local", async () => {
    await withEnv({ SITE_ENV: "local" }, () => {
      const consoleSpy = spy(console, "log");
      try {
        logDebug("debug message");
        assertEquals(consoleSpy.calls.length, 1);
        assertMatch(String(consoleSpy.calls[0].args[0]), /debug message/);
      } finally {
        consoleSpy.restore();
      }
    });
  });

  await test.step("does not log when SITE_ENV is not local", async () => {
    await withEnv({ SITE_ENV: "production" }, () => {
      const consoleSpy = spy(console, "log");
      try {
        logDebug("debug message");
        assertEquals(consoleSpy.calls.length, 0);
      } finally {
        consoleSpy.restore();
      }
    });
  });
});
