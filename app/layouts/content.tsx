import { PageFrame } from "$app/layouts/page.tsx";

export default function Home(data: Lume.Data) {
  const page = data as Lume.Data & { content: string };

  return (
    <PageFrame data={page}>
      <div
        className="page-content"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </PageFrame>
  );
}
