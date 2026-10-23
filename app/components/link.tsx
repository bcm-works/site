export function TagLink({ tag }: { tag: string }) {
  return (
    <a href={`/tags/${tag}/`} title={`View posts tagged with ${tag}`} className="link-tag">
      {tag}
    </a>
  );
}

export function PostLink({ title, url }: { title: string; url: string }) {
  return (
    <a href={url} className="link-post">
      {title}
    </a>
  );
}
