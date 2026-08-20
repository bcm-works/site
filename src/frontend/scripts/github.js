const githubInfo = document.getElementById("github-info");

fetch("/api/github-user/")
  .then((response) => {
    if (!response.ok || response.headers.get("content-type") != "application/json") {
      return "{}";
    }

    return response.json();
  })
  .then((data) => {
    if (data != "{}") {
      if (data.status) {
        githubInfo.querySelector(".github-status .value").innerText = data.status;
        githubInfo.querySelector(".github-status").classList.remove("page-hidden");
        githubInfo.querySelector(".github-status").classList.add("animation-fadein");
      }

      if (data.repos) {
        githubInfo.querySelector(".github-repos .value").innerText = `${data.repos} Public Repos`;
        githubInfo.querySelector(".github-repos").classList.remove("page-hidden");
        githubInfo.querySelector(".github-repos").classList.add("animation-fadein");
      }

      if (data.followers) {
        githubInfo.querySelector(".github-followers .value").innerText = `${data.followers} Followers`;
        githubInfo.querySelector(".github-followers").classList.remove("page-hidden");
        githubInfo.querySelector(".github-followers").classList.add("animation-fadein");
      }

      if (data.following) {
        githubInfo.querySelector(".github-following .value").innerText = `${data.following} Following`;
        githubInfo.querySelector(".github-following").classList.remove("page-hidden");
        githubInfo.querySelector(".github-following").classList.add("animation-fadein");
      }

      if (data.starred) {
        githubInfo.querySelector(".github-starred .value").innerText = `${data.starred} Starred Repos`;
        githubInfo.querySelector(".github-starred").classList.remove("page-hidden");
        githubInfo.querySelector(".github-starred").classList.add("animation-fadein");
      }

      if (data.prs) {
        githubInfo.querySelector(".github-prs .value").innerText = `${data.prs} Pull Requests`;
        githubInfo.querySelector(".github-prs").classList.remove("page-hidden");
        githubInfo.querySelector(".github-prs").classList.add("animation-fadein");
      }

      githubInfo.classList.add("height-auto");
    } else {
      githubInfo.classList.add("animation-fadeout");
      githubInfo.classList.add("height-auto");
      githubInfo.classList.remove("animation-fadeout");
      githubInfo.classList.add("animation-fadein");
    }
  });
