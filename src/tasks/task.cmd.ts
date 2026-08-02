//
//
// Task Runner
//   - This is the source code of the '/task' binary
//   - Rebuild this binary: deno task build-task
//   - The binary will then pass over the first argument to Deno Tasks
//   - Running './task build' is the same as running 'deno task build'
//
//

import { cmdShow } from "@/common/cmd.ts";

const commandArg = Deno.args[0] ?? "list";

cmdShow(`deno task ${commandArg}`);
