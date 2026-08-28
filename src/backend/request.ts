import { Env } from "$be/env.ts";
import { RequestInfoResponse } from "$be/types.ts";

const env = new Env();
const publicDir: string = env.getPublicDir();

export function requestInfo(request: Request): RequestInfoResponse {
  const url: URL = new URL(request.url);
  const path: string = url.pathname;

  let req: string = path.endsWith("/") ? path : `${path}/`;
  req = req.startsWith("/") ? req : `/${path}`;

  // Construct possible file paths
  const fileStatic: string = `./${publicDir}${path}`;
  const filePage: string = `./${publicDir}${req}index.html`;
  const filePost: string = `./${publicDir}/posts${req}index.html`;

  return { url, path, req, fileStatic, filePage, filePost };
}
