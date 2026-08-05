import { assertEquals } from "@std/assert";
import { requestInfo } from "@/backend/request.ts";

Deno.test("REQUEST", async (test) => {
  await test.step({
    name: "parses a root path correctly",
    fn: () => {
      const req = new Request("https://bcm.works/");
      const info = requestInfo(req);

      assertEquals(info.path, "/");
      assertEquals(info.req, "/");
    }
  });

  await test.step({
    name: "normalises a path without trailing slash",
    fn: () => {
      const req = new Request("https://bcm.works/about");
      const info = requestInfo(req);

      assertEquals(info.path, "/about");
      assertEquals(info.req, "/about/");
    }
  });

  await test.step({
    name: "normalises a path with a trailing slash",
    fn: () => {
      const req = new Request("https://bcm.works/about/");
      const info = requestInfo(req);

      assertEquals(info.path, "/about/");
      assertEquals(info.req, "/about/");
    }
  });

  await test.step({
    name: "builds correct file paths",
    fn: () => {
      const req = new Request("https://bcm.works/about/");
      const info = requestInfo(req);

      assertEquals(info.fileStatic.endsWith("/about/"), true);
      assertEquals(info.filePage.endsWith("/about/index.html"), true);
      assertEquals(info.filePost.endsWith("/posts/about/index.html"), true);
    }
  });
});
