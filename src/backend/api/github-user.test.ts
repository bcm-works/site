import { assertEquals, assertNotEquals } from "@std/assert";
import { getGithubUser } from "@/backend/api/github-user.ts";

Deno.test("GITHUB USER", async (test) => {
  await test.step({
    name: "returns '{}' when no token is set",
    fn: async () => {
      const originalToken = Deno.env.get("SITE_GITHUB_ID");
      Deno.env.delete("SITE_GITHUB_ID");

      const result = await getGithubUser();

      assertEquals(result, "{}");

      if (originalToken !== undefined) {
        Deno.env.set("SITE_GITHUB_ID", originalToken);
      }
    }
  });

  await test.step({
    name: "returns a valid response object when token is set",
    fn: async () => {
      const token = Deno.env.get("SITE_GITHUB_ID");

      if (!token) {
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
