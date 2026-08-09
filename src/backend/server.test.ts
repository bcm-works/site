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

  await test.step({
    name: "GET /.well-known/traffic-advice/ returns 200 with traffic-advice content type",
    fn: async () => {
      const req = new Request("https://bcm.works/.well-known/traffic-advice/");
      const res = await server.fetch(req);

      assertEquals(res.status, 200);
      assertEquals(res.headers.get("content-type"), "application/trafficadvice+json");
      await res.body?.cancel();
    }
  });

  await test.step({
    name: "GET /api/github-user/ returns 200",
    fn: async () => {
      const req = new Request("https://bcm.works/api/github-user/");
      const res = await server.fetch(req);

      assertEquals(res.status, 200);
      await res.body?.cancel();
    }
  });

  await test.step({
    name: "GET for an existing static file returns 200",
    fn: async () => {
      await Deno.mkdir("./public/test-coverage", { recursive: true });
      await Deno.writeTextFile("./public/test-coverage/test.html", "<html></html>");
      try {
        const req = new Request("https://bcm.works/test-coverage/test.html");
        const res = await server.fetch(req);

        assertEquals(res.status, 200);
        await res.body?.cancel();
      } finally {
        await Deno.remove("./public/test-coverage", { recursive: true });
      }
    }
  });

  await test.step({
    name: "GET for an existing page index.html returns 200",
    fn: async () => {
      await Deno.mkdir("./public/test-coverage-page", { recursive: true });
      await Deno.writeTextFile("./public/test-coverage-page/index.html", "<html></html>");
      try {
        const req = new Request("https://bcm.works/test-coverage-page/");
        const res = await server.fetch(req);

        assertEquals(res.status, 200);
        await res.body?.cancel();
      } finally {
        await Deno.remove("./public/test-coverage-page", { recursive: true });
      }
    }
  });

  await test.step({
    name: "GET for a post path resolves via posts directory and returns 200",
    fn: async () => {
      await Deno.mkdir("./public/posts/test-coverage-post", { recursive: true });
      await Deno.writeTextFile("./public/posts/test-coverage-post/index.html", "<html></html>");
      try {
        const req = new Request("https://bcm.works/test-coverage-post/");
        const res = await server.fetch(req);

        assertEquals(res.status, 200);
        await res.body?.cancel();
      } finally {
        await Deno.remove("./public/posts/test-coverage-post", { recursive: true });
      }
    }
  });

  await test.step({
    name: "onListen callback executes without throwing",
    fn: () => {
      server.onListen();
    }
  });
});
