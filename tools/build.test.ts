import { assertEquals, assertNotEquals } from "@std/assert";

Deno.test("BUILD", async (test) => {
  await test.step({
    name: "check 'public/index.html'",
    fn: async () => {
      try {
        const fileContent: string = await Deno.readTextFile(
          "public/index.html"
        );

        assertNotEquals(fileContent, "");
      } catch (_) {
        assertEquals("File not found", "");
      }
    }
  });

  await test.step({
    name: "check 'public/sitemap.xml'",
    fn: async () => {
      try {
        const fileContent: string = await Deno.readTextFile(
          "public/sitemap.xml"
        );

        assertNotEquals(fileContent, "");
      } catch (_) {
        assertEquals("File not found", "");
      }
    }
  });

  await test.step({
    name: "check 'public/css/bcm.min.css'",
    fn: async () => {
      try {
        const fileContent: string = await Deno.readTextFile(
          "public/css/bcm.min.css"
        );

        assertNotEquals(fileContent, "");
      } catch (_) {
        assertEquals("File not found", "");
      }
    }
  });

  await test.step({
    name: "check 'public/posts.json'",
    fn: async () => {
      try {
        const fileContent: string = await Deno.readTextFile(
          "public/posts.json"
        );

        assertNotEquals(fileContent, "");
      } catch (_) {
        assertEquals("File not found", "");
      }
    }
  });

  await test.step({
    name: "check 'public/posts.rss'",
    fn: async () => {
      try {
        const fileContent: string = await Deno.readTextFile(
          "public/posts.rss"
        );

        assertNotEquals(fileContent, "");
      } catch (_) {
        assertEquals("File not found", "");
      }
    }
  });

  await test.step({
    name: "check 'public/images/brendan/profile/brendan_750.png'",
    fn: async () => {
      try {
        const fileContent: string = await Deno.readTextFile(
          "public/images/brendan/profile/brendan_750.png"
        );

        assertNotEquals(fileContent, "");
      } catch (_) {
        assertEquals("File not found", "");
      }
    }
  });

  await test.step({
    name: "check 'public/images/brendan/profile/brendan_150.webp'",
    fn: async () => {
      try {
        const fileContent: string = await Deno.readTextFile(
          "public/images/brendan/profile/brendan_150.webp"
        );

        assertNotEquals(fileContent, "");
      } catch (_) {
        assertEquals("File not found", "");
      }
    }
  });

  await test.step({
    name: "check 'public/resume.pdf'",
    fn: async () => {
      try {
        const fileContent: string = await Deno.readTextFile(
          "public/resume.pdf"
        );

        assertNotEquals(fileContent, "");
      } catch (_) {
        assertEquals("File not found", "");
      }
    }
  });

  await test.step({
    name: "check 'public/health'",
    fn: async () => {
      try {
        const fileContent: string = await Deno.readTextFile(
          "public/health"
        );

        assertEquals(fileContent, "OK");
      } catch (_) {
        assertEquals("File not found", "");
      }
    }
  });

  await test.step({
    name: "check 'public/robots.txt'",
    fn: async () => {
      try {
        const fileContent: string = await Deno.readTextFile(
          "public/robots.txt"
        );

        assertNotEquals(fileContent, "");
      } catch (_) {
        assertEquals("File not found", "");
      }
    }
  });
});
