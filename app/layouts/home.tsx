import { PageFrame } from "$app/layouts/page.tsx";
import { type PostData } from "$app/types.ts";
import { PostItem } from "$app/components/post.tsx";
import SocialLinks from "$app/components/social.tsx";

export default function Home(data: Lume.Data) {
  const page = data as Lume.Data & { search: { pages: (...args: string[]) => unknown[] }; SITE_BUILD_ID?: string };
  const posts = page.search.pages("type=post", "date=desc") as PostData[];

  return (
    <PageFrame data={page}>
      <div className="intro">
        <p>I specialise in actively leading software teams to build scalable, well-defined technical solutions.</p>
      </div>

      <div className="social-links-container">
        <SocialLinks buildId={page.SITE_BUILD_ID ?? ""} />
      </div>

      <ul className="posts-list">
        {posts.filter((post) => post.url !== "/posts/").map((post) => <PostItem key={post.url} post={post} />)}
      </ul>
    </PageFrame>
  );
}
