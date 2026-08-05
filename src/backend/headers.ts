import { Env } from "@/common/env.ts";

const env = new Env();
const siteUrl: string = env.getUrl();

// Setup headers for CORS (Cross-Origin Resource Sharing)
export function cors(req: Request): Headers {
  const headers = new Headers();
  const origin = req.headers.get("origin");

  if (origin && origin == siteUrl) {
    headers.set("access-control-allow-origin", origin);
    headers.set("vary", "origin");
  }

  return headers;
}
