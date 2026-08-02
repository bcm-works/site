import { cmd } from "@/common/cmd.ts";
import { logInfo, logWarn } from "@/common/log.ts";
import { Env } from "@/common/env.ts";

const env = new Env();

const buildDir: string = env.get("SITE_BUILD_DIR", "build");
const publicDir: string = env.get("SITE_PUBLIC_DIR", "public");
const cssDir: string = "src/frontend/styles";
const timezone: string = env.get("SITE_TIMEZONE", "Australia/Sydney");
const url: string = env.getUrl();

logWarn("Clearing the build directory and recreating subdirectories");

cmd(`rm -rf "${buildDir}"`);
cmd(`mkdir -p "${buildDir}"`);
cmd(`mkdir -p "${buildDir}/_data"`);
cmd(`cp -r "src/frontend/templates" "${buildDir}/_includes"`);

logWarn("Clearing the public directory and recreating subdirectories");

cmd(`rm -rf "${publicDir}"`);
cmd(`mkdir -p "${publicDir}"`);
cmd(`mkdir -p "${publicDir}/css"`);

logInfo("Applying PurgeCSS updates to site.css");

cmd(`deno x --yes --no-check --unstable-detect-cjs npm:purgecss@8.0.0 \
  --safelist ".content-body" \
  --safelist "blockquote" \
  --safelist "em" \
  --safelist "strong" \
  --css "./src/frontend/styles/site.css" \
  --content "./src/frontend/**/*.njk" \
  --output "./src/frontend/styles/site.css"`);

logInfo("Running Deno code checks");

cmd("deno task check");

logInfo("Copying over page content files to build directory");

cmd(`cp content/*.md "${buildDir}"`);
cmd(`cp -r content/posts "${buildDir}/posts"`);
cmd(`cp -r content/tags "${buildDir}/tags"`);

logInfo("Building the front-end using Lume");

cmd(`TZ="${timezone}" \
  deno task lume \
    --src=${buildDir} \
    --dest=${publicDir} \
    --location=${url}`);

logInfo("Combining CSS files");

cmd(`cat "${cssDir}/reset.css" \
  "${cssDir}/theme.css" \
  "${cssDir}/app.css" \
  "${cssDir}/content.css" \
  "${cssDir}/code.css" \
  "${cssDir}/responsive.css" \
  "${cssDir}/print.css" \
  > "${buildDir}/bcm.css"`);

logInfo("Minifying combined CSS file");

cmd(
  `deno x --yes --no-check npm:lightningcss-cli@1.32.0 \
  --minify \
  --bundle \
  --targets ">= 0.25%" "${buildDir}/bcm.css" \
  --output-file "${publicDir}/css/bcm.min.css"`
);

logInfo("Copying FontAwesome files to public directory");

cmd(`cp -r "src/frontend/styles/fonts" "${publicDir}/css/fonts"`);

logInfo("Copying static files to public directory");

cmd(`cp -r "content/images" "${publicDir}/images"`);
cmd(`cp "content/favicon.ico" "${publicDir}/favicon.ico"`);
cmd(`cp "content/resume.pdf" "${publicDir}/resume.pdf"`);
cmd(`cp "src/frontend/manifest.json" "${publicDir}/manifest.json"`);
cmd(`cp "${publicDir}/posts.json" "${publicDir}/brendan/posts.json"`);

logWarn("Deleting the build directory");

cmd(`rm -rf "${buildDir}"`);

logInfo("Build complete");
