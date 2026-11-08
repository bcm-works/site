export function TagLink({ tag }: { tag: string }) {
  return (
    <a href={`/tags/${tag}/`} title={`View posts tagged with ${tag}`} className="link-tag">
      <span className="icon fa-fw fa-solid fa-tag" aria-hidden="true"></span>
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
