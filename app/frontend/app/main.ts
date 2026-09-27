import { createApp } from "vue";
import GithubInfo from "../components/github.ts";

// This file exists to allow the frontend to interact dynamically
// with the internal backend within Lume's static build output.

const container = document.getElementById("github-info-root");
if (container) {
  createApp(GithubInfo, { username: container.dataset.username ?? "" }).mount(container);
}
