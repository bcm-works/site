import { serveFile } from "@std/http/file-server";
import { fileExists } from "@/common/local.ts";
import { logDebug } from "@/common/log.ts";
import { Env } from "@/common/env.ts";

// Load Env Vars with suitable defaults

const bcm = new Env();
const siteUrl: string = bcm.getUrl();
const publicDir: string = bcm.get("SITE_PUBLIC_DIR", "public");
const appEnv: string = bcm.get("SITE_ENV", "other");
const isLocal: boolean = bcm.isLocal();
const appEnvType: string = isLocal ? "local" : "hosted";

// Start the static web server

Deno.serve(
  {
    onListen() {
      logDebug(
        `[env ${appEnv}] [type ${appEnvType}] Server started at ${siteUrl}`
      );
    }
  },
  async (request: Request) => {
    // Extract the request details
    const url: URL = new URL(request.url);
    let path: string = url.pathname === "/" ? "/index.html" : url.pathname;
    path = path.endsWith("/") ? path.slice(0, -1) : path;

    // Handle static file requests
    const fileStatic: string = `./${publicDir}${path}`;
    if (fileExists(fileStatic)) {
      return await serveFile(request, fileStatic);
    }

    if (path.startsWith("/api")) {
      // Attempt to dynamically import the relevant API file
      const method: string = request.method.toLowerCase();
      let module;
      try {
        module = await import(`./${path}.ts`);
      } catch (_error) {
        bcm.postHogAnonBackendEvent(404, request);
        return Response.redirect(new URL("/", url.origin), 301);
      }

      // Attempt to run the API function that matches the request method
      if (module[method]) {
        return await module[method](request);
      }
    }

    // Fallback to the content API
    const content = await import(`./api/content.ts`);
    return await content["get"](request);
  }
);
