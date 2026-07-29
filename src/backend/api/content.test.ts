import { assertEquals } from "@std/assert";
import { get } from "./content.ts";

Deno.test("API get /api/content", async (test) => {
  // Uses a path that won't match any file in public dir
  const request = new Request("https://bcm.works/nonexistent-page-xyz/");

  await test.step("returns 301 when no matching file exists", async () => {
    const response = await get(request.clone());
    assertEquals(response.status, 301);
  });

  await test.step("redirect location points to site root", async () => {
    const response = await get(request.clone());
    const location = response.headers.get("location") ?? "";
    assertEquals(location.endsWith("/"), true);
  });
});
