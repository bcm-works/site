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
      githubInfo.classList.add("animation-fadeout");

      if (data.status) {
        githubInfo.querySelector(".github-status .value").innerText = data.status;
        githubInfo.querySelector(".github-status").classList.remove("page-hidden");
        githubInfo.querySelector(".github-status").classList.add("animation-fadein");
      }

      if (data.repos) {
        githubInfo.querySelector(".github-repos .value").innerText = `${data.repos} repositories`;
        githubInfo.querySelector(".github-repos").classList.remove("page-hidden");
        githubInfo.querySelector(".github-repos").classList.add("animation-fadein");
      }

      if (data.followers) {
        githubInfo.querySelector(".github-followers .value").innerText = `${data.followers} followers`;
        githubInfo.querySelector(".github-followers").classList.remove("page-hidden");
        githubInfo.querySelector(".github-followers").classList.add("animation-fadein");
      }

      if (data.following) {
        githubInfo.querySelector(".github-following .value").innerText = `${data.following} following`;
        githubInfo.querySelector(".github-following").classList.remove("page-hidden");
        githubInfo.querySelector(".github-following").classList.add("animation-fadein");
      }

      githubInfo.classList.remove("animation-fadeout");
      githubInfo.classList.add("animation-fadein");
    } else {
      githubInfo.classList.add("animation-fadeout");
      githubInfo.classList.add("height-auto");
      githubInfo.classList.remove("animation-fadeout");
      githubInfo.classList.add("animation-fadein");
    }
  });
