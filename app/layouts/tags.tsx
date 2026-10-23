import { PageFrame } from "$app/layouts/page.tsx";
import { TagLink } from "$app/components/link.tsx";
import { type PostData } from "$app/types.ts";

export default function Tags(data: Lume.Data) {
  const page = data as Lume.Data & { search: { pages: (...args: string[]) => unknown[] } };
  const posts = page.search.pages("type=post") as PostData[];
  const tags = [...new Set(posts.flatMap((post) => post.tags ?? []))].filter((tag) => tag !== "Post").sort();

  return (
    <PageFrame data={page}>
      <h2>Post tags</h2>
      <ul className="tag-list">
        {tags.map((tag) => (
          <li>
            <TagLink tag={tag} />
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
