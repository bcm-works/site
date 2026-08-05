import { assertEquals, assertNotEquals } from "@std/assert";
import server from "@/backend/server.ts";

Deno.test("SERVER", async (test) => {
  await test.step({
    name: "OPTIONS preflight returns 204",
    fn: async () => {
      const req = new Request("https://bcm.works/api/health", { method: "OPTIONS" });
      const res = await server.fetch(req);

      assertEquals(res.status, 204);
      assertNotEquals(res.headers.get("access-control-allow-methods"), null);
    }
  });

  await test.step({
    name: "GET /api/health returns 200",
    fn: async () => {
      const req = new Request("https://bcm.works/api/health");
      const res = await server.fetch(req);

      assertEquals(res.status, 200);
    }
  });

  await test.step({
    name: "GET /api/version returns 200 with a non-empty body",
    fn: async () => {
      const req = new Request("https://bcm.works/api/version");
      const res = await server.fetch(req);

      assertEquals(res.status, 200);

      const body = await res.text();
      assertNotEquals(body, "");
    }
  });

  await test.step({
    name: "unknown path returns a redirect",
    fn: async () => {
      const req = new Request("https://bcm.works/this-page-does-not-exist/");
      const res = await server.fetch(req);

      // 404s are redirected to the site root via a 301
      assertEquals(res.status, 301);
    }
  });
});
