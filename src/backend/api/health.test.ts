import { assertEquals } from "@std/assert";
import { get } from "./health.ts";

Deno.test("API get /api/health", async (test) => {
  await test.step("returns 200 status", () => {
    const response = get();
    assertEquals(response.status, 200);
  });

  await test.step("returns 'OK' body", async () => {
    const response = get();
    assertEquals(await response.text(), "OK");
  });
});
