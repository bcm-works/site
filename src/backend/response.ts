import { cors } from "@/backend/headers.ts";
import { Env } from "@/common/env.ts";
import { GitHubUserResponse } from "@/backend/types/github.types.ts";

const env = new Env();
const siteUrl: string = env.getUrl();

export function responseHandler(
  request: Request,
  responseCode: number = 200,
  content: string | GitHubUserResponse | BodyInit | null | undefined = undefined
): Response {
  const headers = cors(request);

  if (responseCode === 404) {
    env.postHogAnonBackendEvent(404, request);
    return Response.redirect(new URL("/", siteUrl), 301);
  }

  headers.set("content-type", "application/json");
  return new Response(JSON.stringify(content), { status: responseCode, headers });
}

export function corsHandler(request: Request): Response {
  const headers = cors(request);

  headers.set("access-control-allow-methods", "GET");
  headers.set("access-control-allow-headers", "content-type, authorization");
  headers.set("access-control-max-age", "86400");

  return new Response(null, {
    status: 204,
    headers
  });
}
