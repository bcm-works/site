import { serveFile } from "@std/http/file-server";
import { Site } from "@/site.class.ts";

// Load Env Vars with suitable defaults

const bcm = new Site();

const siteUrl: string = bcm.getUrl();
const appPort: number = bcm.getPort();
const publicDir: string = bcm.envVar("SITE_PUBLIC_DIR", "public");
const githubToken: string = bcm.envVar("SITE_GITHUB_ID", "");
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
      // bcm.logDebug(`Serving home page`);
      return await serveFile(request, `./${publicDir}/index.html`);
    }

    // Health checks, return a 200 OK response
    if (req == "/health/" || req == "/api/health/" || req == "/status/" || req == "/ping/") {
      // bcm.logDebug(`Serving health check`);
      return new Response("OK", { status: 200 });
    }

    // Return GitHub profile data
    if (req == "/api/github-profile/") {
      // bcm.logDebug(`Serving GitHub profile data`);

      if (githubToken == "") {
        return new Response("{}", { status: 424 });
      }

      const githubResponse = await fetch(
        "https://api.github.com/users/bcm-works",
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${githubToken}`,
            "User-Agent": "bcm-works",
            "X-GitHub-Api-Version": "2026-03-10",
            "Content-Type": "application/json",
          },
        },
      );

      if (!githubResponse.ok) {
        return new Response("{}", { status: 424 });
      }

      const githubJson = await githubResponse.json();

      const returnString = JSON.stringify({
        username: githubJson.login,
        name: githubJson.name,
        bio: githubJson.bio,
        hireable: githubJson.hireable,
        url: githubJson.html_url,
        repos: githubJson.public_repos,
        followers: githubJson.followers,
        following: githubJson.following,
      });

      return new Response(
        returnString,
        { headers: { "content-type": "application/json" } },
      );
    }

    // Static file request
    //   - Covers direct file requests like an image or CSS file
    if (bcm.fileExists(fileStatic)) {
      // bcm.logDebug(`Serving static file: ${fileStatic}`);
      return await serveFile(request, fileStatic);
    }

    // Page request
    //   - Covers pages like '/tags/' and '/posts/20260616_ai-code-gen/'
    if (bcm.fileExists(filePage)) {
      // bcm.logDebug(`Serving page: ${filePage}`);
      return await serveFile(request, filePage);
    }

    // Post request
    //   - Requests like '/20260616_ai-code-gen/' will use the same file as '/posts/20260616_ai-code-gen/'
    //   - Canonical URLs for every page are set in the frontend layout file
    if (bcm.fileExists(filePost)) {
      // bcm.logDebug(`Serving post: ${filePost}`);
      return await serveFile(request, filePost);
    }

    // No related file was found
    //   - Log an anonymous error to PostHog
    //   - Redirect to the homepage
    bcm.postHogAnonBackendEvent(404, request);
    // bcm.logDebug(`Serving 404: ${requestPath}`);
    return Response.redirect(new URL("/", requestUrl.origin), 301);
  },
);
