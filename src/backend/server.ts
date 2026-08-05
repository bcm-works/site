import { serveFile } from "@std/http/file-server";
import { fileExists } from "@/common/local.ts";
import { logSuccess } from "@/common/log.ts";
import { Env } from "@/common/env.ts";
import { getGithubUser } from "@/backend/api/github-user.ts";
import { GitHubUserResponse } from "@/backend/types/github.ts";

// Load Env Vars with suitable defaults

const env = new Env();
const publicDir: string = env.get("SITE_PUBLIC_DIR", "public");
const siteUrl: string = env.getUrl();

const allowedOrigins = new Set([
  siteUrl,
  "https://bcm-site.murty.deno.net/"
]);

function corsHeaders(req: Request): Headers {
  const headers = new Headers();
  const origin = req.headers.get("origin");

  if (origin && allowedOrigins.has(origin)) {
    headers.set("access-control-allow-origin", origin);
    headers.set("vary", "origin");
  }

  return headers;
}

export default {
  async fetch(request: Request) {
    const url: URL = new URL(request.url);
    const path: string = url.pathname;
    let req: string = path.endsWith("/") ? path : `${path}/`;
    req = req.startsWith("/") ? req : `/${path}`;

    const headers = corsHeaders(request);

    if (request.method === "OPTIONS") {
      headers.set("access-control-allow-methods", "GET");
      headers.set("access-control-allow-headers", "content-type, authorization");
      headers.set("access-control-max-age", "86400");

      return new Response(null, {
        status: 204,
        headers
      });
    }

    if (path === "/api/health" || path === "/api/health/") {
      return new Response("OK", { status: 201, headers });
    }

    if (path === "/api/github-user/") {
      const apiResponse: GitHubUserResponse = await getGithubUser();
      return Response.json(apiResponse, { status: 200, headers });
    }

    // Construct possible file paths
    const fileStatic: string = `./${publicDir}${path}`;
    const filePage: string = `./${publicDir}${req}index.html`;
    const filePost: string = `./${publicDir}/posts${req}index.html`;

    // Handle static file requests
    if (fileExists(fileStatic)) {
      return await serveFile(request, fileStatic);
    }

    // Page request
    //   - Covers pages like '/tags/' and '/posts/'
    if (fileExists(filePage)) {
      return await serveFile(request, filePage);
    }

    // Post request
    //   - Requests like '/20260616_ai-code-gen/' will use the same file as '/posts/20260616_ai-code-gen/'
    //   - Canonical URLs for every page are set in the frontend layout file
    if (fileExists(filePost)) {
      return await serveFile(request, filePost);
    }

    // No related file was found
    //   - Log an anonymous PostHog event
    //   - Redirect to the homepage
    env.postHogAnonBackendEvent(404, request);
    return Response.redirect(new URL("/", siteUrl), 301);
  },
  onListen: () => {
    logSuccess(`Server started at ${siteUrl}`);
  }
} satisfies Deno.ServeDefaultExport;
