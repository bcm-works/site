import { extract as extractMarkdown } from "@std/front-matter/yaml";
import { join } from "@std/path/posix";
import { MarkdownContent } from "@/types/markdown.type.ts";
import { render as renderMarkdown } from "@deno/gfm";
import { existsSync as fileExists } from "@std/fs/exists";

const DIR_CONTENT = Deno.env.get("SITE_CONTENT_DIR") || "./content";

// Get all posts
export async function getPosts(): Promise<MarkdownContent[]> {
  const posts = await getContentInDir('posts') as MarkdownContent[];

  posts.sort((a, b) => b.attrs.date.getTime() - a.attrs.date.getTime());

  return posts;
}

// Get all content within a directory
export async function getContentInDir(subdir?: string): Promise<MarkdownContent[]> {
  const items = Deno.readDir(subdir ? join(DIR_CONTENT, subdir) : DIR_CONTENT);
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
  if (slug == "/") slug = "home";

  const filePath = join(DIR_CONTENT, `${slug}.md`);
  const fileContent = await Deno.readTextFile(filePath);
  const { attrs, contentMarkdown } = extractMarkdown(fileContent) as unknown as MarkdownContent;

  const contentHtml = await renderMarkdown(contentMarkdown);

  console.log(
    'getContent',
    slug,
    filePath,
    fileExists(filePath),
    extractMarkdown(fileContent),
    {
      attrs,
      contentMarkdown,
      contentHtml,
    }
  );

  return {
    attrs,
    contentMarkdown,
    contentHtml,
  };
}
