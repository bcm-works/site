import { assertEquals } from "@std/assert";
import { dirExists, fileExists } from "@/backend/local.ts";

Deno.test("COMMON local", async (test) => {
  await test.step({
    name: "fileExists returns true for a known file",
    fn: () => {
      assertEquals(fileExists("deno.json"), true);
    }
  });

  await test.step({
    name: "fileExists returns false for a nonexistent file",
    fn: () => {
      assertEquals(fileExists("nonexistent-file-xyz.txt"), false);
    }
  });

  await test.step({
    name: "fileExists returns false for a directory path",
    fn: () => {
      assertEquals(fileExists("src"), false);
    }
  });

  await test.step({
    name: "dirExists returns true for a known directory",
    fn: () => {
      assertEquals(dirExists("src"), true);
    }
  });

  await test.step({
    name: "dirExists returns false for a nonexistent directory",
    fn: () => {
      assertEquals(dirExists("nonexistent-dir-xyz"), false);
    }
  });

  await test.step({
    name: "dirExists returns false for a file path",
    fn: () => {
      assertEquals(dirExists("deno.json"), false);
    }
  });
});
