import { serveFile } from "@std/http/file-server";
import { Site } from "$be/site.class.ts";

// Load Env Vars with suitable defaults

const bcm = new Site("./.site.env");

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
    const requestUrl: URL = new URL(request.url);
    const requestPath: string = requestUrl.pathname;
    const req: string = requestPath.endsWith("/") ? requestPath : `${requestPath}/`;

    const fileStatic: string = `./${publicDir}${requestPath}`;
    const filePage: string = `./${publicDir}${req}index.html`;
    const filePost: string = `./${publicDir}/posts${req}index.html`;

    if (!req || req == "/") {
      return await serveFile(request, `./${publicDir}/index.html`);
    }

    if (bcm.fileExists(fileStatic)) {
      return await serveFile(request, fileStatic);
    }

    if (bcm.fileExists(filePage)) {
      return await serveFile(request, filePage);
    }

    if (bcm.fileExists(filePost)) {
      return await serveFile(request, filePost);
    }

    if (!bcm.fileExists(fileStatic)) {
      const homePage = new URL("/", requestUrl.origin);
      return Response.redirect(homePage, 301);
    }

    return await serveFile(request, fileStatic);
  },
);
