import { graphql as GithubGraphQL } from "@octokit/graphql";
import { Env } from "@/backend/env.ts";
import { GitHubUserQuery, GitHubUserResponse } from "@/backend/server.types.ts";

const env = new Env();
const githubToken: string = env.get("SITE_GITHUB_ID", "");

// GET /api/github-user
export async function getGithubUser(token: string = githubToken): Promise<GitHubUserResponse | "{}"> {
  if (token == "") {
    return "{}";
  }

  const githubQuery = GithubGraphQL.defaults({
    headers: {
      authorization: `token ${token}`,
      userAgent: "bcm-works"
    }
  });

  const { user }: GitHubUserQuery = await githubQuery(
    `{
      user(login: "bcm-works") {
        login
        name
        url
        repositories(privacy: PUBLIC) {
          totalCount
        }
        followers {
          totalCount
        }
        following {
          totalCount
        }
        status {
          message
        }
        starredRepositories {
          totalCount
        }
        pullRequests {
          totalCount
        }
      }
    }`
  );

  const returnString: GitHubUserResponse = {
    username: user?.login,
    name: user?.name,
    status: user?.status?.message,
    url: user?.url,
    repos: user?.repositories.totalCount,
    followers: user?.followers.totalCount,
    following: user?.following.totalCount,
    starred: user?.starredRepositories?.totalCount,
    prs: user?.pullRequests?.totalCount,
  };

  return returnString;
}
