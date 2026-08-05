export interface GitHubUserQuery {
  user: {
    login: string;
    name: string;
    status?: {
      message: string;
    };
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
}
