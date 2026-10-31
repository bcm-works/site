import { assertEquals } from "@std/assert";
import { addPostDescription, postDescription } from "$tools/post-description.ts";

Deno.test("postDescription returns the first two plain-text sentences", () => {
  assertEquals(
    postDescription("[First](https://example.com) sentence. **Second** well-defined sentence! Third sentence."),
    "First sentence. Second well-defined sentence!"
  );
});

Deno.test("addPostDescription adds a description to front matter", () => {
  assertEquals(
    addPostDescription("---\ntitle: Example\n---\nFirst sentence. Second sentence."),
    '---\ndescription: "First sentence. Second sentence."\ntitle: Example\n---\nFirst sentence. Second sentence.'
  );
});

Deno.test("addPostDescription preserves an explicit description", () => {
  const post = "---\ndescription: Existing description.\n---\nFirst sentence.";
  assertEquals(addPostDescription(post), post);
});
