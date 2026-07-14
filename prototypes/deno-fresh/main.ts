import { App, staticFiles } from "fresh";
import { format } from "date-fns";
import { State } from "@/utils/state.ts";
import { MarkdownContent } from "@/types/markdown.type.ts";
import { getContent } from "@/utils/content.ts";

export const app = new App<State>();

app.use(staticFiles());

// Return 200 OK for /health requests
app.get("/health", () => {
  return new Response(
    `OK`,
    {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
});

// Redirect example
// app.get("/old-url", () => {
//   return ctx.redirect("/new-url", 307);
// });

// Pass the relevant environment variables, with suitable defaults,
// in to the app context so they can be accessed via 'ctx.state'.
app.use(async (ctx) => {
  console.log('ctx config initial', ctx.config);
  console.log('ctx url initial', ctx.url);

  ctx.state.SITE_AUTHOR = Deno.env.get("SITE_AUTHOR") || "Brendan Murty";
  ctx.state.SITE_TITLE = Deno.env.get("SITE_TITLE") || "Public website for Brendan Murty";
  ctx.state.SITE_DESC = Deno.env.get("SITE_DESC") || "Brendan is a Father, Schnitzel Reviewer, and Technical Leader.";
  ctx.state.SITE_LANG = Deno.env.get("SITE_LANG") || "en-GB";
  ctx.state.SITE_TIMEZONE = Deno.env.get("SITE_TIMEZONE") || "Australia/Sydney";

  ctx.state.SITE_URL = Deno.env.get("SITE_URL") || "https://bcm.works";
  ctx.state.SITE_ENV = Deno.env.get("SITE_ENV") || "hosted";
  ctx.state.SITE_LOCAL = Deno.env.get("SITE_ENV") === "local" || false;

  ctx.state.SITE_POSTHOG_ID = Deno.env.get("SITE_POSTHOG_ID") || "";
  ctx.state.SITE_POSTHOG_API_HOST = Deno.env.get("SITE_POSTHOG_API_HOST") || "https://eu.posthog.com";
  ctx.state.SITE_POSTHOG_UI_HOST = Deno.env.get("SITE_POSTHOG_UI_HOST") || "https://eu.posthog.com";

  // The build date is used for static file cache refreshes
  const dateNow: Date = new Date();
  ctx.state.SITE_BUILD_DATE = Deno.env.get("SITE_BUILD_DATE") || format(dateNow, "yyyyMMddHHmmss");

  console.log('ctx state after load', ctx.state);

  return await ctx.next();
});

app.get("*", async (ctx) => {
  console.log(':page route initial ctx.url.pathname', ctx.url.pathname);

  const data: MarkdownContent | null = await getContent(ctx.url.pathname);

  if (!data) {
    return new Response("Page not found", { status: 404 });
  }

  return new Response(JSON.stringify({ data }), {
    headers: { "Content-Type": "application/json" },
  });
});

app.fsRoutes();
