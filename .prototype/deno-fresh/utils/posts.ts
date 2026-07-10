import { extractJson } from "@std/front-matter";
import { join } from "@std/path/posix";

const DIRECTORY = "../../content/posts";

export interface Post {
  url: string;
  oldUrl?: string;
  title: string;
  date: Date;
  tags?: string[];
  content: string;
}

interface PostFrontMatter {
  attrs: Post;
  body: string;
}

// Get all posts
export async function getPosts(): Promise<Post[]> {
  const files = Deno.readDir(DIRECTORY);
  const promises = [];
  for await (const file of files) {
    const slug = file.name.replace(".md", "");
    promises.push(getPost(slug));
  }
  const posts = await Promise.all(promises) as Post[];
  posts.sort((a, b) => b.date.getTime() - a.date.getTime());
  return posts;
}

// Get an individual post
export async function getPost(slug: string): Promise<Post | null> {
  const text = await Deno.readTextFile(join(DIRECTORY, `${slug}.md`));
  const { attrs, body } = extractJson(text) as PostFrontMatter;
  return {
    url: attrs.url,
    title: attrs?.title,
    date: new Date(attrs.date),
    content: body,
    tags: attrs.tags,
  };
}
