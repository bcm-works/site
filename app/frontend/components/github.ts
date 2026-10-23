import { defineComponent, h, onMounted, ref } from "vue";
import { type GithubUser } from "../types.ts";

type GithubProfileResponse = {
  public_repos?: number;
  followers?: number;
  following?: number;
};

type GithubSearchResponse = {
  total_count?: number;
};

const githubHeaders = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28"
};

async function getGithubUser(username: string): Promise<GithubUser> {
  const profileResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
    headers: githubHeaders
  });

  if (!profileResponse.ok) {
    throw new Error(`GitHub profile request failed with status ${profileResponse.status}`);
  }

  const profile = await profileResponse.json() as GithubProfileResponse;
  const user: GithubUser = {
    repos: profile.public_repos,
    followers: profile.followers,
    following: profile.following
  };

  const [starredResult, pullRequestsResult] = await Promise.allSettled([
    fetch(`https://api.github.com/users/${encodeURIComponent(username)}/starred?per_page=1`, {
      headers: githubHeaders
    }),
    fetch(`https://api.github.com/search/issues?q=author:${encodeURIComponent(username)}+type:pr`, {
      headers: githubHeaders
    })
  ]);

  if (starredResult.status === "fulfilled" && starredResult.value.ok) {
    const link = starredResult.value.headers.get("link");
    const lastPage = link?.match(/[?&]page=(\d+)[^>]*>; rel="last"/)?.[1];

    if (lastPage) {
      user.starred = Number(lastPage);
    } else {
      const starred = await starredResult.value.json() as unknown[];
      user.starred = starred.length;
    }
  }

  if (pullRequestsResult.status === "fulfilled" && pullRequestsResult.value.ok) {
    const pullRequests = await pullRequestsResult.value.json() as GithubSearchResponse;
    user.prs = pullRequests.total_count;
  }

  return user;
}

export default defineComponent({
  props: {
    username: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const user = ref<GithubUser>({});
    const loaded = ref(false);

    onMounted(() => {
      getGithubUser(props.username)
        .then((githubUser) => {
          user.value = githubUser;
        })
        .catch(() => {
          // The profile link remains available if GitHub is unavailable.
        })
        .finally(() => {
          loaded.value = true;
        });
    });

    return () => {
      const values = [
        { className: "github-status", icon: "fa-comment", value: user.value.status },
        {
          className: "github-repos",
          icon: "fa-code",
          value: user.value.repos ? `${user.value.repos} Public Repos` : undefined
        },
        {
          className: "github-prs",
          icon: "fa-code-pull-request",
          value: user.value.prs ? `${user.value.prs} Pull Requests` : undefined
        },
        {
          className: "github-starred",
          icon: "fa-star",
          value: user.value.starred ? `${user.value.starred} Starred Repos` : undefined
        },
        {
          className: "github-following",
          icon: "fa-people-group",
          value: user.value.following ? `${user.value.following} Following` : undefined
        },
        {
          className: "github-followers",
          icon: "fa-people-group",
          value: user.value.followers ? `${user.value.followers} Followers` : undefined
        }
      ];

      return h("div", { id: "github-info", class: loaded.value ? "height-auto" : "print-hidden" }, [
        h("ul", [
          h("li", { class: "github-user" }, [
            h("span", { class: "icon fa-fw fa-brands fa-github" }),
            h("a", {
              href: `https://github.com/${props.username}`,
              class: "value",
              title: "View my profile on GitHub"
            }, props.username)
          ]),
          ...values.map(({ className, icon, value }) => h("li", {
            key: className,
            class: `${className}${value ? " animation-fadein" : " page-hidden"}`
          }, [
            h("span", { class: `icon fa-fw fa-solid ${icon}` }),
            h("span", { class: "value" }, value)
          ]))
        ])
      ]);
    };
  }
});
