import { assertEquals, assertNotEquals } from "@std/assert";
import { getGithubUser } from "@/backend/api/github-user.ts";

const hasToken = !!Deno.env.get("SITE_GITHUB_ID");

Deno.test("GITHUB USER", async (test) => {
  await test.step({
    name: "returns '{}' when no token is set",
    fn: async () => {
      if (hasToken) {
        console.log("Skipping: SITE_GITHUB_ID is set");
        return;
      }

      const result = await getGithubUser();
      assertEquals(result, "{}");
    }
  });

  await test.step({
    name: "returns a valid response object when token is set",
    fn: async () => {
      if (!hasToken) {
        console.log("Skipping: SITE_GITHUB_ID not set");
        return;
      }

      const result = await getGithubUser();

      assertNotEquals(result, "{}");

      if (typeof result !== "string") {
        assertNotEquals(result.username, undefined);
        assertNotEquals(result.url, undefined);
      }
    }
  });
});
