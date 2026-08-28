import { assertEquals } from "@std/assert";
import { logDebug, logError, logHighlight, logInfo, logSuccess, logWarn } from "$be/log.ts";

Deno.test("COMMON log", async (test) => {
  const fns: Array<[string, (msg: string) => void]> = [
    ["logHighlight", logHighlight],
    ["logInfo", logInfo],
    ["logSuccess", logSuccess],
    ["logWarn", logWarn],
    ["logError", logError],
    ["logDebug", logDebug]
  ];

  for (const [name, fn] of fns) {
    await test.step({
      name: `${name} shows a message`,
      fn: () => {
        const original = console.log;
        const captured: unknown[] = [];
        console.log = (...args) => captured.push(args);

        try {
          fn("test message");
          assertEquals(captured.length, 1);
        } finally {
          console.log = original;
        }
      }
    });
  }
});
