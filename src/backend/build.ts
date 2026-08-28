import { cmd, cmdShow } from "$be/cmd.ts";
import { logInfo, logWarn } from "$be/log.ts";
import { Env } from "$be/env.ts";

const env = new Env();

const buildDir: string = env.getBuildDir();
const publicDir: string = env.getPublicDir();
const cssDir: string = "src/frontend/styles";
const timezone: string = env.get("SITE_TIMEZONE", "Australia/Sydney");
const url: string = env.getUrl();

logWarn(`Clearing the build (./${buildDir}) and public (./${publicDir}) directories`);

cmd(`rm -rf "${buildDir}"`);
cmd(`mkdir -p "${buildDir}"`);
cmd(`mkdir -p "${buildDir}/_data"`);
cmd(`cp -r "src/frontend/templates" "${buildDir}/_includes"`);

cmd(`rm -rf "${publicDir}"`);
cmd(`mkdir -p "${publicDir}"`);
cmd(`mkdir -p "${publicDir}/css"`);

logInfo("Applying PurgeCSS updates to site.css");

cmd(`deno --quiet x --yes --no-check --unstable-detect-cjs npm:purgecss@8.0.0 \
  --safelist ".content-body" \
  --safelist "blockquote" \
  --safelist "em" \
  --safelist "strong" \
  --css "./src/frontend/styles/site.css" \
  --content "./src/frontend/**/*.njk" \
  --output "./src/frontend/styles/site.css"`);

logInfo("Copying over page content files to build directory");

cmd(`cp content/*.md "${buildDir}"`);
cmd(`cp -r content/posts "${buildDir}/posts"`);
cmd(`cp -r content/tags "${buildDir}/tags"`);

logInfo("Building the front-end using Lume");

cmdShow(`TZ="${timezone}" \
  LUME_LOGS=error \
  deno --quiet task lume \
    --src=${buildDir} \
    --dest=${publicDir} \
    --location=${url}`);

logInfo("Combining and minifying CSS");

cmd(`cat "${cssDir}/reset.css" \
  "${cssDir}/theme.css" \
  "${cssDir}/animations.css" \
  "${cssDir}/layout.css" \
  "${cssDir}/content.css" \
  "${cssDir}/code.css" \
  "${cssDir}/screen-small.css" \
  "${cssDir}/print.css" \
  > "${buildDir}/bcm.css"`);

cmdShow(
  `deno --quiet x --yes --no-check npm:lightningcss-cli@1.32.0 \
  --minify \
  --bundle \
  --targets ">= 0.25%" "${buildDir}/bcm.css" \
  --output-file "${publicDir}/css/bcm.min.css"`
);

logInfo("Copying static files to the public directory");

cmd(`cp -r "src/frontend/styles/fonts" "${publicDir}/css/fonts"`);
cmd(`cp -r "content/images" "${publicDir}/images"`);
cmd(`cp "content/favicon.ico" "${publicDir}/favicon.ico"`);
cmd(`cp "content/resume.pdf" "${publicDir}/resume.pdf"`);
cmd(`cp -r "src/frontend/scripts" "${publicDir}/scripts"`);
cmd(`cp "src/frontend/manifest.json" "${publicDir}/manifest.json"`);

logWarn("Deleting the build directory");

cmd(`rm -rf "${buildDir}"`);

logInfo("Build complete");
