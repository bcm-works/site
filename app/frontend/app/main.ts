import { createApp } from "vue";
import GithubInfo from "../components/github.ts";

// This file mounts the dynamic frontend components in Lume's static build output.

const container = document.getElementById("github-info-root");
if (container) {
  createApp(GithubInfo, {
    username: container.dataset.username ?? ""
  }).mount(container);
}
