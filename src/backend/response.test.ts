import { assertEquals, assertNotEquals } from "@std/assert";
import { responseHandler } from "@/backend/response.ts";

Deno.test("RESPONSE", async (test) => {
  await test.step({
    name: "returns 200 with JSON content",
    fn: async () => {
      const req = new Request("https://bcm.works/api/health");
      const res = responseHandler(req, 200, "OK");

      assertEquals(res.status, 200);
      assertEquals(res.headers.get("content-type"), "application/json");

      const body = await res.json();
      assertNotEquals(body, null);
    }
  });

  await test.step({
    name: "returns a redirect for 404",
    fn: () => {
      const req = new Request("https://bcm.works/missing-page/");
      const res = responseHandler(req, 404);

      // responseHandler redirects 404s to the site root via a 301
      assertEquals(res.status, 301);
    }
  });

  await test.step({
    name: "returns CORS headers for an allowed origin",
    fn: () => {
      const allowedOrigin = "https://www.bcm.works";
      const req = new Request("https://bcm.works/api/health", {
        headers: { origin: allowedOrigin }
      });
      const res = responseHandler(req, 200, "OK");

      assertEquals(res.headers.get("access-control-allow-origin"), allowedOrigin);
    }
  });
});
