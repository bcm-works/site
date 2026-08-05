import { serveFile } from "@std/http/file-server";
import { fileExists } from "@/common/local.ts";
import { logSuccess } from "@/common/log.ts";
import { Env } from "@/common/env.ts";
import { cors } from "@/backend/headers.ts";
import { requestInfo } from "@/backend/request.ts";
import { responseHandler } from "@/backend/response.ts";
import { getGithubUser } from "@/backend/api/github-user.ts";
import { GitHubUserResponse } from "@/backend/types/github.types.ts";
import { RequestInfoResponse } from "@/backend/types/request.types.ts";

// Load Env Vars with suitable defaults

const env = new Env();
const siteUrl: string = env.getUrl();
const buildId: string = env.getBuildId();

export default {
  async fetch(request: Request) {
    const { path, fileStatic, filePage, filePost }: RequestInfoResponse = requestInfo(request);

    // CORS options request
    if (request.method === "OPTIONS") {
      const headers = cors(request);
      headers.set("access-control-allow-methods", "GET");
      headers.set("access-control-allow-headers", "content-type, authorization");
      headers.set("access-control-max-age", "86400");

      return new Response(null, {
        status: 204,
        headers
      });
    }

    // API - Health
    if (path === "/api/health" || path === "/api/health/") {
      return responseHandler(request, 200, "OK");
    }

    // API - Version
    if (path === "/api/version" || path === "/api/version/") {
      return responseHandler(request, 200, buildId);
    }

    // API - GitHub User Info
    if (path === "/api/github-user/") {
      const apiResponse: GitHubUserResponse | "{}" = await getGithubUser();
      return responseHandler(request, 200, apiResponse);
    }

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
    return responseHandler(request, 404);
  },
  onListen: () => {
    logSuccess(`Server started at ${siteUrl}`);
  }
} satisfies Deno.ServeDefaultExport;
