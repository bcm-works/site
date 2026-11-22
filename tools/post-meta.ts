import { logInfo, logSuccess } from "$tools/log.ts";
import { addPostDescription } from "$tools/post-descr.ts";

const contentDir: string = "content";

logInfo("Adding 'description' meta content to post files");

for await (const entry of Deno.readDir(`${contentDir}/posts`)) {
  if (!entry.isFile || !entry.name.endsWith(".md") || entry.name === "index.md") continue;

  const postPath = `${contentDir}/posts/${entry.name}`;

  const post = await Deno.readTextFile(postPath);

  await Deno.writeTextFile(postPath, addPostDescription(post));
}

logSuccess("Updated post files");
