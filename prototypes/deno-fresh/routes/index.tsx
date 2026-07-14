// deno-lint-ignore-file react-no-danger

import { HttpError, page } from "fresh";
import { define } from "@/utils/state.ts";
import { MarkdownContent } from "@/types/markdown.type.ts";
import { getContent } from "@/utils/content.ts";

interface Data {
  data: MarkdownContent;
}

export const handler = define.handlers({
  async GET(ctx) {
    console.log('index handler', ctx);

    // ctx.state.page = await getContent(ctx.url.pathname) || { attrs: {}, contentMarkdown: "", contentHtml: "" };
    const data: MarkdownContent | null = await getContent(ctx.params.page);// Partial<MarkdownContent> | null

    if (!data) {
      throw new HttpError(404);
    }

    return page(
      data,
      {
        status: 201,
        headers: {
          "Cache-Control": "public, max-age=3600"
        },
      }
    );
  },
});

export default define.page<typeof handler>(({ data }) => {
  return (
    <div class="page-content-container">
      <h2>{data.attrs.title}</h2>
      <div class="page-content max-w-screen-md mx-auto flex flex-col"
        dangerouslySetInnerHTML={{ __html: data.contentHtml }} />
    </div>
  );
});
