// Backend Types

export interface RequestInfoResponse {
  url: URL;
  path: string;
  req: string;
  fileStatic: string;
  filePage: string;
  filePost: string;
}

export interface PrefetchProxyResponse {
  user_agent: "prefetch-proxy";
  fraction: number;
}

export type ResponseHandlerResponse =
  | string
  | PrefetchProxyResponse
  | BodyInit
  | null
  | undefined;
