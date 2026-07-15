import { join } from "@std/path/posix";
import { MarkdownContent, MarkdownContentList } from "@/types/markdown.type.ts";
import { renderWithMeta } from "@deer/gfm";
import { existsSync as fileExists } from "@std/fs/exists";

export const SITE_CONTENT_DIR = Deno.env.get("SITE_CONTENT_DIR") || "./content";

// Get all content within a directory
export async function getContentInDir(subdir?: string): Promise<MarkdownContentList | []> {
  const dirPath = subdir ? join(SITE_CONTENT_DIR, subdir) : SITE_CONTENT_DIR;

  if (!fileExists(dirPath)) return [];

  const items = Deno.readDir(dirPath);
  const output: MarkdownContent[] = [];

  for await (const item of items) {
    if (item.isFile) {
      const slug = item.name.replace(".md", "");
      const content = await getContent(slug);
      if (!Array.isArray(content)) output.push(content);
    }
  }

  return output;
}

// Get an individual page or post
export async function getContent(slug: string): Promise<MarkdownContent | []> {
  if (!slug) return [];
  if (slug == "/") slug = "/home";

  const filePath = join(SITE_CONTENT_DIR, slug) + '.md';

  if (!fileExists(filePath)) return [];

  const fileContent = await Deno.readTextFile(filePath);
  const { html, frontmatter } = await renderWithMeta(fileContent);

  return {
    [slug]: {
      attrs: frontmatter,
      contentMarkdown: fileContent,
      contentHtml: html,
    }
  };
}
