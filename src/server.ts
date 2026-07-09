import { serveFile } from "@std/http/file-server";
import { Site } from "src/site.class.ts";

// Load Env Vars with suitable defaults

const bcm = new Site();

const siteUrl: string = bcm.getUrl();
const appPort: number = bcm.getPort();
const publicDir: string = bcm.envVar("SITE_PUBLIC_DIR", "public");
const appEnv: string = bcm.envVar("SITE_ENV", "other");
const isLocal: boolean = bcm.isLocal();
const appEnvType: string = isLocal ? "local" : "hosted";

// Start the static web server

Deno.serve(
  {
    port: appPort,
    onListen() {
      bcm.logAlways(
        `[env ${appEnv}] [type ${appEnvType}] [port ${appPort}] Server started at ${siteUrl}`,
      );
    },
  },
  async (request: Request) => {
    // Extract the request details
    const requestUrl: URL = new URL(request.url);
    const requestPath: string = requestUrl.pathname;

    // Ensure the request ends with a forward slash
    //   - Simplifies logic below
    //   - Matches the way Lume is configured to build 'index.html' files inside of content build directories
    const req: string = requestPath.endsWith("/") ? requestPath : `${requestPath}/`;

    // Construct possible file paths
    const fileStatic: string = `./${publicDir}${requestPath}`;
    const filePage: string = `./${publicDir}${req}index.html`;
    const filePost: string = `./${publicDir}/posts${req}index.html`;

    // No request path, serve the top level index file
    if (!req || req == "/") {
      return await serveFile(request, `./${publicDir}/index.html`);
    }

    // Health checks, return a 200 OK response
    if (req == "/health/" || req == "/api/health/" || req == "/status/" || req == "/ping/") {
      return new Response("OK", { status: 200 });
    }

    // Static file request
    //   - Covers direct file requests like an image or CSS file
    if (bcm.fileExists(fileStatic)) {
      return await serveFile(request, fileStatic);
    }

    // Page request
    //   - Covers pages like '/search/' and '/posts/20260616_ai-code-gen/'
    if (bcm.fileExists(filePage)) {
      return await serveFile(request, filePage);
    }

    // Post request
    //   - Requests like '/20260616_ai-code-gen/' will use the same file as '/posts/20260616_ai-code-gen/'
    //   - Canonical URLs for every page are set in the frontend layout file
    if (bcm.fileExists(filePost)) {
      return await serveFile(request, filePost);
    }

    // No related file was found
    //   - Log an anonymous error to PostHog
    //   - Redirect to the homepage
    bcm.postHogAnonBackendEvent(404, request);
    return Response.redirect(new URL("/", requestUrl.origin), 301);
  },
);
