// deno-lint-ignore-file react-no-danger

import { Head } from "fresh/runtime";
import { define } from "@/utils/state.ts";

export default define.page(function Home(ctx) {
  console.log('ctx.state from routes index', ctx.state);

  return (
    <div class="px-4 py-8 mx-auto min-h-screen">
      <Head>
        <title>home</title>
      </Head>
      <div dangerouslySetInnerHTML={{ __html: ctx.state.page.contentHtml }} class="page-content max-w-screen-md mx-auto flex flex-col"/>
    </div>
  );
});
