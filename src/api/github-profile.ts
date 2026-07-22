import { graphql as GithubGraphQL } from "@octokit/graphql";
import { Site } from "@/site.class.ts";

const bcm = new Site();
const githubToken: string = bcm.envVar("SITE_GITHUB_ID", "");

type GitHubUserResponse = {
  user: {
    login: string;
    name: string;
    status: {
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
  } | null;
};

// GET /api/github-profile
export async function get(): Promise<Response> {
  if (githubToken == "") {
    return new Response("{}", { status: 424 });
  }

  const githubQuery = GithubGraphQL.defaults({
    headers: {
      authorization: `token ${githubToken}`,
      userAgent: "bcm-works",
    },
  });

  const { user }: GitHubUserResponse = await githubQuery(
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
    }`,
  );

  const returnString = JSON.stringify({
    username: user?.login,
    name: user?.name,
    status: user?.status.message,
    url: user?.url,
    repos: user?.repositories.totalCount,
    followers: user?.followers.totalCount,
    following: user?.following.totalCount,
  });

  return new Response(
    returnString,
    { headers: { "content-type": "application/json" } },
  );
}
