import { SitePageData as SitePageDataBase } from "$app/types.ts";
import { Stats } from "$app/layouts/stats.tsx";

interface PageFrameProps {
  data: SitePageData;
  children: unknown;
}

type SitePageData = Lume.Data & SitePageDataBase;

const speculationRules = JSON.stringify({
  prefetch: [{
    source: "list",
    requires: ["anonymous-client-ip-when-cross-origin"],
    urls: ["posts/index.html", "tags/index.html"]
  }],
  prerender: [{
    source: "document",
    where: {
      and: [
        { href_matches: "/*" },
        { not: { href_matches: "/*.pdf" } },
        { not: { selector_matches: ".no-prerender" } },
        { not: { selector_matches: "[rel~=nofollow]" } }
      ]
    },
    eagerness: "moderate"
  }]
});

export function PageFrame({ data, children }: PageFrameProps) {
  const author = data.SITE_AUTHOR ?? "";
  const siteUrl = data.SITE_URL ?? "";
  const buildId = data.SITE_BUILD_ID ?? "";
  const description = data.description ?? data.SITE_FEED_DESC ?? "";
  const title = data.title ? `${author} - ${data.title}` : author;
  const image = data.photo_thumb_url ?? data.photo_url ?? data.SITE_SOCIAL_SHARE_IMAGE;
  const date = data.date ? data.date.toISOString().slice(0, 10) : undefined;

  return (
    <html lang={data.SITE_LANG ?? "en-GB"}>
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <link rel="canonical" href={`${siteUrl}${data.url}`} />
        <link rel="me" href="https://mastodon.social/@murty" />
        <meta name="handheldfriendly" content="true" />
        <meta name="mobileoptimized" content="480" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content={data.theme ?? "#23C5B0"} />
        <meta name="author" content={author} />
        <meta name="description" content={description} />
        {date && <meta property="article:published_time" content={date} />}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={data.SITE_LANG ?? "en-GB"} />
        <meta property="og:title" content={title} />
        <meta property="og:url" content={`${siteUrl}${data.url}`} />
        <meta name="og:description" content={description} />
        <meta property="og:image" content={`${siteUrl}${image}`} />

        <link rel="preload" href="/css/fonts/MDIO-Black.woff" as="font" crossOrigin="anonymous" />
        <link rel="preload" href="/css/fonts/MDIO-Regular.woff" as="font" crossOrigin="anonymous" />
        <link rel="preload" href={`/css/bcm.min.css?v=${buildId}`} as="style" />
        <link rel="stylesheet" href={`/css/bcm.min.css?v=${buildId}`} />
        <link rel="preload" href={`/css/fonts/fontawesome/css/all.min.css?v=${buildId}`} as="style" />
        <link rel="stylesheet" href={`/css/fonts/fontawesome/css/all.min.css?v=${buildId}`} />
        <link rel="manifest" href="/manifest.json" />
        <link rel="alternate" title={data.SITE_FEED_TITLE ?? ""} type="application/json" href="/posts.json" />
        <link rel="alternate" title={data.SITE_FEED_TITLE ?? ""} type="application/rss+xml" href="/posts.rss" />
        <link rel="icon" sizes="192x192" href="/images/logos/android-chrome-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/logos/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/logos/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/logos/apple-touch-icon.png" />

        <script type="speculationrules" dangerouslySetInnerHTML={{ __html: speculationRules }} />

        <Stats
          token={data.SITE_CLOUDFLARE_ANALTICS_TOKEN}
        />
      </head>
      <body className={`${data.body_class ?? ""} env-${data.SITE_ENV ?? ""} build-${buildId}`}>
        <div className="layout-container">
          <header>
            <aside>
              <a href="/" className="site-link" title="Go to the home page">
                <img
                  className="site-avatar"
                  alt=""
                  width="100"
                  height="100"
                  src="/images/brendan/profile/brendan_150.webp"
                />
                <span className="site-name">{author}</span>
              </a>
            </aside>

            <nav>
              <ul>
                <li className={data.url === "/" ? "active" : undefined}>
                  <a href="/" title="Go to the home page">Home</a>
                </li>
                <li className={data.url.includes("/posts/") ? "active" : undefined}>
                  <a href="/posts/" title="View all posts">Posts</a>
                </li>
                <li className={data.url.includes("/tags/") ? "active" : undefined}>
                  <a href="/tags/" title="View all tags">Tags</a>
                </li>
              </ul>
            </nav>
          </header>

          <main>
            <article className="content-body">
              <div className="print-header">
                <h1>{author}</h1>
                <p>{siteUrl}{data.url}</p>
              </div>
              <div className="content-container">{children}</div>
            </article>
          </main>
        </div>
      </body>
    </html>
  );
}

export default function Page(data: Lume.Data) {
  const page = data as SitePageData;
  return <PageFrame data={page}>{page.content ?? ""}</PageFrame>;
}
