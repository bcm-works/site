import { serveFile } from "@std/http/file-server";
import { fileExists } from "@/backend/local.ts";
import { logSuccess } from "@/backend/log.ts";
import { Env } from "@/backend/env.ts";
import { requestInfo } from "@/backend/request.ts";
import { corsHandler, responseHandler } from "@/backend/response.ts";
import { getGithubUser } from "@/backend/api/github-user.ts";
import { GitHubUserResponse, PrefetchProxyResponse, RequestInfoResponse } from "@/backend/server.types.ts";

// Load Env Vars with suitable defaults

const env = new Env();
const siteUrl: string = env.getUrl();
const buildId: string = env.getBuildId();

export default {
  async fetch(request: Request) {
    const { req, fileStatic, filePage, filePost }: RequestInfoResponse = requestInfo(request);

    // CORS options request
    if (request.method === "OPTIONS") {
      return corsHandler(request);
    }

    // Allow prefetching pages in Chrome
    if (req === "/.well-known/traffic-advice/") {
      const prefetchResponse: PrefetchProxyResponse = {
        "user_agent": "prefetch-proxy",
        "fraction": 1.0
      };

      return responseHandler(
        request,
        200,
        prefetchResponse,
        "application/trafficadvice+json"
      );
    }

    // API - Health
    if (req === "/api/health/") {
      return responseHandler(request, 200, "OK");
    }

    // API - Version
    if (req === "/api/version/") {
      return responseHandler(request, 200, buildId);
    }

    // API - GitHub User Info
    if (req === "/api/github-user/") {
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
