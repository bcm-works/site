// deno-lint-ignore-file react-no-danger

import { page } from "fresh";
import { define } from "@/utils/state.ts";
import { MarkdownContent, MarkdownPage } from "@/types/markdown.type.ts";
import { getContent } from "@/utils/content.ts";

export const handler = define.handlers({
  async GET(ctx) {
    console.log('index handler', ctx);

    const slug: string = ctx.url.pathname || "/";
    const data: MarkdownContent | [] = await getContent(ctx.url.pathname);

    if (!data || Array.isArray(data)) {
      return new Response("Page not found", { status: 404 });
    }

    const pageData: MarkdownPage = data[slug];

    return page(
      pageData,
      {
        status: 201,
        headers: {
          "Cache-Control": "public, max-age=3600"
        },
      }
    );
  },
});

export default define.page(function Home(ctx) {
  return (
    <div class="px-4 py-8 mx-auto min-h-screen page-content-container">
      <h2>{ctx.state.page?.attrs?.title ?? ""}</h2>
      <div class="page-content max-w-screen-md mx-auto flex flex-col"
        dangerouslySetInnerHTML={{ __html: ctx.state.page?.contentHtml ?? "" }} />
    </div>
  );
});
