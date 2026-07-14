import { join } from "@std/path/posix";
import { MarkdownContent } from "@/types/markdown.type.ts";
import { renderWithMeta } from "@deer/gfm";
import { existsSync as fileExists } from "@std/fs/exists";

const dirContent = Deno.env.get("SITE_CONTENT_DIR") || "./content";

// Get all content within a directory
export async function getContentInDir(subdir?: string): Promise<MarkdownContent[]> {
  const items = Deno.readDir(subdir ? join(dirContent, subdir) : dirContent);
  const promises = [];

  for await (const item of items) {
    if (item.isFile) {
      const slug = item.name.replace(".md", "");
      promises.push(getContent(slug));
    }
  }

  return await Promise.all(promises) as MarkdownContent[];
}

// Get an individual page or post
export async function getContent(slug: string): Promise<MarkdownContent | null> {
  if (!slug) return null;
  if (slug == "/") slug = "/home";

  const filePath = `${dirContent}${slug}.md`;

  if (!fileExists(filePath)) return null;

  const fileContent = await Deno.readTextFile(filePath);

  // const { attrs, contentMarkdown } = extractFrontmatter(fileContent) as unknown as MarkdownContent;
  // const contentHtml = await renderMarkdown(contentMarkdown);

  const { html, frontmatter } = await renderWithMeta(fileContent);

  console.log('getContent', slug, filePath, fileContent);

  return {
    attrs: frontmatter,
    contentMarkdown: fileContent,
    contentHtml: html,
  };
}
