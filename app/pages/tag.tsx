import { PageFrame } from "$app/components/layout.tsx";
import type { PostData } from "$app/types.ts";
import { PostItem } from "$app/components/content.tsx";

export default function Tag(data: Lume.Data) {
  const page = data as Lume.Data & { search: { pages: (...args: string[]) => unknown[] } };
  const tag = page.url.replace("/tags/", "").replaceAll("/", "");
  const posts = page.search.pages(`${tag} type=post`, "date=desc") as PostData[];

  return (
    <PageFrame data={page}>
      <ul className="posts-list">
        {posts.filter((post) => post.url !== "/posts/").map((post) => <PostItem key={post.url} post={post} />)}
      </ul>
    </PageFrame>
  );
}
