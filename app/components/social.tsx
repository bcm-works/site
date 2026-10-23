export default function SocialLinks({ buildId }: { buildId: string }) {
  return (
    <ul className="social-links">
      <li>
        <a href="mailto:brendan@bcm.works" target="_blank" title="Send me an email at brendan@bcm.works">
          <span className="icon fa-fw fa-solid fa-envelope"></span>
          <span className="label">Email</span>
        </a>
      </li>
      <li>
        <a href={`/resume.pdf?v=${buildId}`} download="Resume - Brendan Murty.pdf" title="Download my resume">
          <span className="icon fa-fw fa-solid fa-address-card"></span>
          <span className="label">Resume</span>
        </a>
      </li>
      <li>
        <a href="https://www.linkedin.com/in/bcm-works" title="View my LinkedIn profile">
          <span className="icon fa-fw fa-brands fa-linkedin"></span>
          <span className="label">LinkedIn</span>
        </a>
      </li>
      <li>
        <a href="https://mastodon.social/@murty" title="Find me on Mastodon" rel="me">
          <span className="icon fa-fw fa-brands fa-mastodon"></span>
          <span className="label">Mastodon</span>
        </a>
      </li>
      <li>
        <a href="https://steamcommunity.com/id/bcmurty/" title="View my Steam profile">
          <span className="icon fa-fw fa-brands fa-steam"></span>
          <span className="label">Steam</span>
        </a>
      </li>
      <li>
        <a href="https://discordapp.com/users/362579289700302858" title="View my Discord profile">
          <span className="icon fa-fw fa-brands fa-discord"></span>
          <span className="label">Discord</span>
        </a>
      </li>
    </ul>
  );
}
