import { PageFrame } from "$app/layouts/page.tsx";
import { type PostData } from "$app/types.ts";
import { PostItem } from "$app/components/post.tsx";

export default function Posts(data: Lume.Data) {
  const page = data as Lume.Data & { search: { pages: (...args: string[]) => unknown[] } };
  const posts = page.search.pages("type=post", "date=desc") as PostData[];

  return (
    <PageFrame data={page}>
      <h2>Posts</h2>
      <ul className="posts-list">
        {posts.filter((post) => post.url !== "/posts/").map((post) => <PostItem key={post.url} post={post} />)}
      </ul>
    </PageFrame>
  );
}
