import { graphql as GithubGraphQL } from "@octokit/graphql";
import { Env } from "@/common/env.ts";
import { GitHubUserQuery, GitHubUserResponse } from "@/backend/server.types.ts";

const env = new Env();
const githubToken: string = env.get("SITE_GITHUB_ID", "");

// GET /api/github-user
export async function getGithubUser(): Promise<GitHubUserResponse | "{}"> {
  if (githubToken == "") {
    return "{}";
  }

  const githubQuery = GithubGraphQL.defaults({
    headers: {
      authorization: `token ${githubToken}`,
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
    following: user?.following.totalCount
  };

  return returnString;
}
