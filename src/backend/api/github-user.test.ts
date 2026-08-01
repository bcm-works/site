import { assertEquals, assertObjectMatch } from "@std/assert";
import { Env } from "@/common/env.ts";
import { get } from "./github-user.ts";

const env = new Env();

const hasToken: boolean = env.hasEnvVar("SITE_GITHUB_ID");

Deno.test("API get /api/github-user", async (test) => {
  if (hasToken) {
    await test.step("returns 200 when token is configured", async () => {
      const response = await get();
      assertEquals(response.status, 200);
    });

    await test.step("returns JSON content-type when token is configured", async () => {
      const response = await get();
      assertEquals(response.headers.get("content-type"), "application/json");
    });

    await test.step("returns expected user fields when token is configured", async () => {
      const response = await get();
      const body = await response.json();
      assertObjectMatch(body, {
        username: "bcm-works",
        url: "https://github.com/bcm-works",
      });
    });
  } else {
    await test.step("returns 424 when no token is configured", async () => {
      const response = await get();
      assertEquals(response.status, 424);
    });

    await test.step("returns empty JSON object when no token is configured", async () => {
      const response = await get();
      assertEquals(await response.text(), "{}");
    });
  }
});
