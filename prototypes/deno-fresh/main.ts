import { App, staticFiles } from "fresh";
import { type State } from "@/utils/define.ts";

export const app = new App<State>();

app.use(staticFiles());

// Pass the relevant environment variables, with suitable defaults,
// in to the app context so they can be accessed via 'ctx.state'.
app.use(async (ctx) => {
  ctx.state.SITE_AUTHOR = Deno.env.get("SITE_AUTHOR") || "Brendan Murty";
  ctx.state.SITE_TITLE = Deno.env.get("SITE_TITLE") || "";
  ctx.state.SITE_DESC = Deno.env.get("SITE_DESC") || "";
  ctx.state.SITE_LANG = Deno.env.get("SITE_LANG") || "en-GB";
  ctx.state.SITE_TIMEZONE = Deno.env.get("SITE_TIMEZONE") || "Australia/Sydney";
  ctx.state.SITE_URL = Deno.env.get("SITE_URL") || "https://bcm.works";
  ctx.state.SITE_ENV = Deno.env.get("SITE_ENV") || "hosted";
  ctx.state.SITE_LOCAL = Deno.env.get("SITE_ENV") === "local" || false;
  ctx.state.SITE_BUILD_DATE = Deno.env.get("SITE_BUILD_DATE") || "";
  ctx.state.SITE_POSTHOG_ID = Deno.env.get("SITE_POSTHOG_ID") || "";
  ctx.state.SITE_POSTHOG_API_HOST = Deno.env.get("SITE_POSTHOG_API_HOST") || "";
  ctx.state.SITE_POSTHOG_UI_HOST = Deno.env.get("SITE_POSTHOG_UI_HOST") || "";

  return await ctx.next();
});

app.fsRoutes();
