import { defineComponent, h, onMounted, ref } from "vue";
import { type GithubUser } from "../types.ts";

export default defineComponent({
  props: {
    username: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const user = ref<GithubUser | null>(null);
    const loaded = ref(false);

    onMounted(() => {
      fetch("/api/github-user/")
        .then((response) => {
          if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) {
            return null;
          }

          return response.json() as Promise<GithubUser>;
        })
        .then((data) => {
          user.value = data;
          loaded.value = true;
        })
        .catch(() => {
          loaded.value = true;
        });
    });

    return () => {
      const values = [
        { className: "github-status", icon: "fa-comment", value: user.value?.status },
        {
          className: "github-repos",
          icon: "fa-code",
          value: user.value?.repos ? `${user.value.repos} Public Repos` : undefined
        },
        {
          className: "github-prs",
          icon: "fa-code-pull-request",
          value: user.value?.prs ? `${user.value.prs} Pull Requests` : undefined
        },
        {
          className: "github-starred",
          icon: "fa-star",
          value: user.value?.starred ? `${user.value.starred} Starred Repos` : undefined
        },
        {
          className: "github-following",
          icon: "fa-people-group",
          value: user.value?.following ? `${user.value.following} Following` : undefined
        },
        {
          className: "github-followers",
          icon: "fa-people-group",
          value: user.value?.followers ? `${user.value.followers} Followers` : undefined
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
