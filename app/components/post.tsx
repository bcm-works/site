import { format } from "date-fns";
import { TagLink } from "$app/components/link.tsx";
import { type PostData } from "$app/types.ts";

export function PostItem({ post }: { post: PostData; key?: string }) {
  // Strip out HTML and Markdown Link formatting
  const content = (post.content ?? "").replace(/<[^>]*>/g, "").replace(/\[(.*?)\]\((.*?)\)/g, "$1").trim();

  // Limit the length of the content to 140 characters
  const summary = content.length > 140 ? `${content.slice(0, 137)}...` : content;

  return (
    <li className="post-item">
      <a className="post-item-link" href={post.url}>
        <span className="post-item-title">{post.title}</span>
        {summary && <span className="post-item-summary">{summary}</span>}
      </a>
      <div className="post-details">
        <PostInfo date={post.date} words={post.readingInfo?.words ?? 0} />
      </div>
    </li>
  );
}

export function PostInfo({ date, words }: { date: Date; words: number }) {
  return (
    <ul className="post-info print-gray">
      <li className="post-date">
        <span className="icon fa-fw fa-solid fa-calendar-days"></span>
        <span className="value">{format(date, "d LLL yyyy")}</span>
      </li>
      <li className="post-words">
        <span className="icon fa-fw fa-solid fa-file-lines"></span>
        <span className="value">{words} words</span>
      </li>
    </ul>
  );
}

export function PostHeading({ title }: { title: string }) {
  return <h2>{title}</h2>;
}

export function PostTags({ tags }: { tags: string[] }) {
  return (
    <ul className="tag-list print-hidden">
      {tags.filter((tag) => tag !== "Post").sort().map((tag) => (
        <li key={tag}>
          <TagLink tag={tag} />
        </li>
      ))}
    </ul>
  );
}
