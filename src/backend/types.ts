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

export interface GitHubUserQuery {
  user: {
    login: string;
    name: string;
    url: string;
    repositories: {
      totalCount: number;
    };
    followers: {
      totalCount: number;
    };
    following: {
      totalCount: number;
    };
    status?: {
      message: string;
    };
    starredRepositories?: {
      totalCount: number;
    };
    pullRequests?: {
      totalCount: number;
    };
  };
}

export interface GitHubUserResponse {
  username: string | undefined;
  name: string | undefined;
  status: string | undefined;
  url: string | undefined;
  repos: number | undefined;
  followers: number | undefined;
  following: number | undefined;
  starred: number | undefined;
  prs: number | undefined;
}

export type ResponseHandlerResponse =
  | string
  | GitHubUserResponse
  | PrefetchProxyResponse
  | BodyInit
  | null
  | undefined;
