import { PageFrame } from "$app/layouts/page.tsx";
import { PostList } from "$app/components/posts.tsx";

export default function Home(data: Lume.Data) {
  const page = data as Lume.Data & { search: { pages: (...args: string[]) => unknown[] }; SITE_BUILD_ID?: string };

  return (
    <PageFrame data={page}>
      <div className="intro">
        <p>I specialise in actively leading software teams to build scalable, well-defined technical solutions.</p>
      </div>

      <PostList data={page} />
    </PageFrame>
  );
}
