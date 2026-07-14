import { extractJson } from "@std/front-matter";
import { join } from "@std/path/posix";
import { MarkdownContent, MarkdownFrontMatter } from "@/types/markdown.type.ts";

const DIR_CONTENT = Deno.env.get("SITE_CONTENT_DIR") || "../../content";

// Get all posts
export async function getPosts(): Promise<MarkdownContent[]> {
  const posts = await getContentInDir('posts') as MarkdownContent[];

  posts.sort((a, b) => b.date.getTime() - a.date.getTime());

  return posts;
}

// Get all content within a directory
export async function getContentInDir(subdir?: string): Promise<MarkdownContent[]> {
  const files = Deno.readDir(subdir ? join(DIR_CONTENT, subdir) : DIR_CONTENT);
  const promises = [];

  for await (const file of files) {
    const slug = file.name.replace(".md", "");
    promises.push(getContent(slug));
  }

  return await Promise.all(promises) as MarkdownContent[];
}

// Get an individual page or post
export async function getContent(slug: string): Promise<MarkdownContent | null> {
  const text = await Deno.readTextFile(join(DIR_CONTENT, `${slug}.md`));
  const { attrs, body } = extractJson(text) as MarkdownFrontMatter;

  return {
    url: attrs.url,
    title: attrs?.title,
    date: new Date(attrs.date),
    content: body,
    tags: attrs.tags,
  };
}
