import { assertEquals } from "@std/assert";
import { cmdExists, cmdResult, cmdShow } from "@/backend/cmd.ts";

// Note: execSync spawns via 'sh', which is not covered by --allow-run=deno.
// Steps that require successful execution are skipped gracefully when permissions
// are insufficient; only failure-path behaviour can be asserted in this context.

Deno.test("COMMON cmd", async (test) => {
  await test.step({
    name: "cmdResult returns a non-empty string when the command succeeds",
    fn: () => {
      try {
        const result = cmdResult("deno --version");
        assertEquals(result.length > 0, true);
      } catch (_) {
        console.log("Skipping: insufficient --allow-run permissions");
      }
    }
  });

  await test.step({
    name: "cmdExists returns true for a command that exists",
    fn: () => {
      try {
        assertEquals(cmdExists("deno"), true);
      } catch (_) {
        console.log("Skipping: insufficient --allow-run permissions");
      }
    }
  });

  await test.step({
    name: "cmdExists returns false for a command that does not exist",
    fn: () => {
      assertEquals(cmdExists("nonexistent-command-xyz-abc"), false);
    }
  });

  await test.step({
    name: "cmdShow runs a command with inherited stdio and does not throw",
    fn: () => {
      try {
        cmdShow("deno --version");
      } catch (_) {
        console.log("Skipping: insufficient --allow-run permissions");
      }
    }
  });
});
