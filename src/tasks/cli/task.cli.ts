//
//
// Deno Task Runner
//   - This is the source code of the './task' binary
//   - Passes over the first argument sent to it to Deno Tasks
//   - For example, running './task build' is the same as running 'deno task build'
//   - Rebuild the './task' binary: deno task build-cli
//
//

import { cmdShow } from "@/common/cmd.ts";

const commandArg = Deno.args[0] ?? "list";

cmdShow(`deno task ${commandArg}`);
