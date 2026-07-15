import { define } from "@/utils/state.ts";

export default define.page((ctx) => {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{ctx.state.page?.attrs?.title ?? ctx.state.SITE_AUTHOR}</title>
      </head>
      <body>
        <ctx.Component />
      </body>
    </html>
  );
});
