import type { SitePageData as SitePageDataBase } from "$app/types.ts";

export function Nav({ data }: { data: Lume.Data & SitePageDataBase }) {
  const buildId: string = data.SITE_BUILD_ID ?? "";

  return (
    <nav>
      <ul>
        <li className={data.url === "/" ? "active" : undefined}>
          <a href="/" title="Go to the home page">
            <span className="icon fa-fw fa-solid fa-home"></span>
            <span className="label">Home</span>
          </a>
        </li>
        <li className={data.url.includes("/posts/") ? "active" : undefined}>
          <a href="/posts/" title="View all posts">
            <span className="icon fa-fw fa-solid fa-newspaper"></span>
            <span className="label">Posts</span>
          </a>
        </li>
        <li className={data.url.includes("/tags/") ? "active" : undefined}>
          <a href="/tags/" title="View all tags">
            <span className="icon fa-fw fa-solid fa-tag"></span>
            <span className="label">Tags</span>
          </a>
        </li>
        <li>
          <a href="mailto:brendan@bcm.works" target="_blank" title="Send me an email at brendan@bcm.works">
            <span className="icon fa-fw fa-solid fa-envelope"></span>
          </a>
        </li>
        <li>
          <a href={`/resume.pdf?v=${buildId}`} download="Resume - Brendan Murty.pdf" title="Download my resume">
            <span className="icon fa-fw fa-solid fa-address-card"></span>
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/bcm-works" title="View my LinkedIn profile">
            <span className="icon fa-fw fa-brands fa-linkedin"></span>
          </a>
        </li>
        <li>
          <a href="https://github.com/bcm-works" title="View my profile on GitHub">
            <span className="icon fa-fw fa-brands fa-github"></span>
          </a>
        </li>
        <li>
          <a href="https://steamcommunity.com/id/bcmurty/" title="View my Steam profile">
            <span className="icon fa-fw fa-brands fa-steam"></span>
          </a>
        </li>
        <li>
          <a href="https://discordapp.com/users/362579289700302858" title="View my Discord profile">
            <span className="icon fa-fw fa-brands fa-discord"></span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
