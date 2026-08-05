import { assertEquals, assertNotEquals } from "@std/assert";
import { cors } from "@/backend/headers.ts";

Deno.test("HEADERS", async (test) => {
  await test.step({
    name: "returns no CORS headers for an unknown origin",
    fn: () => {
      const req = new Request("https://bcm.works/", {
        headers: { origin: "https://unknown-origin.com" }
      });
      const headers = cors(req);

      assertEquals(headers.get("access-control-allow-origin"), null);
    }
  });

  await test.step({
    name: "returns no CORS headers when origin is absent",
    fn: () => {
      const req = new Request("https://bcm.works/");
      const headers = cors(req);

      assertEquals(headers.get("access-control-allow-origin"), null);
    }
  });

  await test.step({
    name: "returns CORS headers for an allowed origin",
    fn: () => {
      const allowedOrigin = "https://www.bcm.works";
      const req = new Request("https://bcm.works/", {
        headers: { origin: allowedOrigin }
      });
      const headers = cors(req);

      assertEquals(headers.get("access-control-allow-origin"), allowedOrigin);
      assertNotEquals(headers.get("vary"), null);
    }
  });
});
