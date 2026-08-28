import { Env } from "$be/env.ts";

const env = new Env();
const siteUrl: string = env.getUrl();

// Define the request origin domains that will be allowed by CORS
const allowedOrigins = new Set([
  siteUrl,
  "https://www.bcm.works",
  "https://murty.au",
  "https://www.murty.au",
  "https://bcm.id.au",
  "https://www.bcm.id.au"
]);

// Setup headers for CORS (Cross-Origin Resource Sharing)
export function cors(req: Request): Headers {
  const headers = new Headers();
  const origin = req.headers.get("origin");

  if (origin && allowedOrigins.has(origin)) {
    headers.set("access-control-allow-origin", origin);
    headers.set("vary", "origin");
  }

  return headers;
}
