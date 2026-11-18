import { PageFrame } from "$app/layouts/page.tsx";
import { PostList } from "$app/components/posts.tsx";

export default function Posts(data: Lume.Data) {
  const page = data as Lume.Data & { search: { pages: (...args: string[]) => unknown[] } };

  return (
    <PageFrame data={page}>
      <h2>Posts</h2>

      <PostList data={page} />
    </PageFrame>
  );
}
