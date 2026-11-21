import { PageFrame } from "$app/components/layout.tsx";
import { PostList } from "$app/components/content.tsx";

export default function Posts(data: Lume.Data) {
  const page = data as Lume.Data & { search: { pages: (...args: string[]) => unknown[] } };

  return (
    <PageFrame data={page}>
      <PostList data={page} />
    </PageFrame>
  );
}
