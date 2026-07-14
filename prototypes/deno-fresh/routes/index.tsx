import { useSignal } from "@preact/signals";
import { Head } from "fresh/runtime";
import { define } from "@/utils/define.ts";

export default define.page(function Home(ctx) {
  // console.log("Shared value " + ctx.state.shared);

  return (
    <div class="px-4 py-8 mx-auto fresh-gradient min-h-screen">
      <Head>
        <title>home</title>
      </Head>
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        home page
      </div>
    </div>
  );
});
