import { serveFile } from "@std/http/file-server";
import { Site } from "$be/site.class.ts";

// Load Env Vars with suitable defaults

const bcm = new Site("./.site.env");

const publicDir: string = bcm.envVar("SITE_PUBLIC_DIR", "public");
const appPort: number = bcm.envVarNumber("SITE_PORT", 8000);
const appEnv: string = bcm.envVar("SITE_ENV", "other");
const isLocal: boolean = bcm.isLocal();
const appEnvType: string = isLocal ? "local" : "hosted";
const appHostname: string = bcm.envVar("SITE_DOCKER_HOSTNAME", "0.0.0.0");
const siteUrl: string = bcm.getUrl();

// Allow browser caching of responses for 30 days

const appCacheConfig: string = "public, max-age=2592000, s-maxage=2592000";

// Helper function to serve a file with custom cache config

async function serveFileWithCache(request: Request, localPath: string): Promise<Response> {
  const res = await serveFile(request, localPath);

  res.headers.set(
    "Cache-Control",
    appCacheConfig,
  );

  return res;
}

// Start the static web server

Deno.serve(
  {
    port: appPort,
    hostname: appHostname,
    onListen() {
      bcm.logAlways(
        `[env ${appEnv}] [type ${appEnvType}] [port ${appPort}] Server started at ${siteUrl}`,
      );
    },
  },
  async (request: Request) => {
    const requestUrl: URL = new URL(request.url);
    const requestPath: string = requestUrl.pathname;
    const req: string = requestPath.endsWith("/") ? requestPath : `${requestPath}/`;

    const fileStatic: string = `./${publicDir}${requestPath}`;
    const filePage: string = `./${publicDir}${req}index.html`;
    const filePost: string = `./${publicDir}/posts${req}index.html`;

    if (!req || req == "/") {
      return await serveFileWithCache(request, `./${publicDir}/index.html`);
    }

    if (bcm.fileExists(fileStatic)) {
      return await serveFileWithCache(request, fileStatic);
    }

    if (bcm.fileExists(filePage)) {
      return await serveFileWithCache(request, filePage);
    }

    if (bcm.fileExists(filePost)) {
      return await serveFileWithCache(request, filePost);
    }

    if (!bcm.fileExists(fileStatic)) {
      const homePage = new URL("/", requestUrl.origin);
      return Response.redirect(homePage, 301);
    }

    return await serveFileWithCache(request, fileStatic);
  },
);
