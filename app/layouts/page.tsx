import { SitePageData as SitePageDataBase } from "$app/types.ts";

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
        { not: { href_matches: "/api/*(/)" } },
        { not: { selector_matches: ".no-prerender" } },
        { not: { selector_matches: "[rel~=nofollow]" } }
      ]
    },
    eagerness: "moderate"
  }]
});

const posthogLoader = (id: string, apiHost: string, uiHost: string) => `
!function(t,e){var o,n,p,r;e.__SV||(window.posthog&&window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)},o="init capture register register_once register_for_session unregister unregister_for_session unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
posthog.init('${id}', {
  api_host: '${apiHost}',
  ui_host: '${uiHost}',
  defaults: '2026-05-30',
  person_profiles: 'always',
});`;

export function PageFrame({ data, children }: PageFrameProps) {
  const author = data.SITE_AUTHOR ?? "";
  const siteUrl = data.SITE_URL ?? "";
  const buildId = data.SITE_BUILD_ID ?? "";
  const description = data.description ?? data.SITE_FEED_DESC ?? "";
  const title = data.title ? `${author} - ${data.title}` : author;
  const image = data.photo_thumb_url ?? data.photo_url ?? "/images/brendan/profile/brendan_750.png";
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
        {data.SITE_POSTHOG_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: posthogLoader(
                data.SITE_POSTHOG_ID,
                data.SITE_POSTHOG_API_HOST ?? "",
                data.SITE_POSTHOG_UI_HOST ?? ""
              )
            }}
          />
        )}
        <script type="speculationrules" dangerouslySetInnerHTML={{ __html: speculationRules }} />
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
        <script type="module" src="/app/main.js"></script>
      </body>
    </html>
  );
}

export default function Page(data: Lume.Data) {
  const page = data as SitePageData;
  return <PageFrame data={page}>{page.content ?? ""}</PageFrame>;
}
