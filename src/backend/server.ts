import { serveFile } from "@std/http/file-server";
import { fileExists } from "@/common/local.ts";
import { Env } from "@/common/env.ts";

// Load Env Vars with suitable defaults

const bcm = new Env();
const publicDir: string = bcm.get("SITE_PUBLIC_DIR", "public");

// Start the static web server

Deno.serve(
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
