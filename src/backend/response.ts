import { cors } from "@/backend/headers.ts";
import { requestInfo } from "@/backend/request.ts";
import { logDebug } from "@/common/log.ts";
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
  const { url, path, req } = requestInfo(request);

  logDebug(`response code=${responseCode} url=${url} path=${path} req=${req}`);

  if (responseCode === 404) {
    env.postHogAnonBackendEvent(404, request);
    return Response.redirect(new URL("/", siteUrl), 301);
  }

  headers.set("content-type", "application/json");
  return new Response(JSON.stringify(content), { status: responseCode, headers });
}
