import { serveFile } from "@std/http/file-server";
import { fileExists } from "@/common/local.ts";
import { Env } from "@/common/env.ts";

const env = new Env();
const publicDir: string = env.get("SITE_PUBLIC_DIR", "public");
const siteUrl: string = env.getUrl();

// GET /api/content
export async function get(request: Request): Promise<Response> {
  const url: URL = new URL(request.url);
  const path: string = url.pathname;
  let req: string = path.endsWith("/") ? path : `${path}/`;
  req = req.startsWith("/") ? req : `/${path}`;

  // Construct possible file paths
  const filePage: string = `./${publicDir}${req}index.html`;
  const filePost: string = `./${publicDir}/posts${req}index.html`;

  // Page request
  //   - Covers pages like '/tags/' and '/posts/20260616_ai-code-gen/'
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
}
