import { cmd, cmdShow } from "$tools/cmd.ts";
import { logInfo, logSuccess, logWarn } from "$tools/log.ts";
import { Env } from "$be/env.ts";

const env = new Env();

const buildDir: string = env.getBuildDir();
const publicDir: string = env.getPublicDir();
const cssDir: string = "app/frontend/styles";
const timezone: string = env.get("SITE_TIMEZONE", "Australia/Sydney");
const url: string = env.getUrl();

logWarn(`Clearing the build (./${buildDir}) and public (./${publicDir}) directories`);

cmd(`rm -rf "${buildDir}"`);
cmd(`mkdir -p "${buildDir}"`);
cmd(`mkdir -p "${buildDir}/_data"`);
cmd(`mkdir -p "${buildDir}/_includes/layouts"`);
cmd(`mkdir -p "${buildDir}/_includes/components"`);
cmd(`cp -r "app/frontend/layouts/." "${buildDir}/_includes/layouts"`);
cmd(`cp -r "app/frontend/components/." "${buildDir}/_includes/components"`);
cmd(`cp -r "app/frontend/app" "${buildDir}/app"`);
cmd(`mkdir -p "${buildDir}/components"`);
cmd(`cp -r "app/frontend/components/." "${buildDir}/components"`);

cmd(`rm -rf "${publicDir}"`);
cmd(`mkdir -p "${publicDir}"`);
cmd(`mkdir -p "${publicDir}/css"`);

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

logInfo("Combining, optimising and minifying CSS");

cmd(`cat "${cssDir}/reset.css" \
  "${cssDir}/theme.css" \
  "${cssDir}/animations.css" \
  "${cssDir}/base.css" \
  "${cssDir}/layout.css" \
  "${cssDir}/content.css" \
  "${cssDir}/social-links.css" \
  "${cssDir}/github-info.css" \
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

cmd(`cp -r "app/frontend/styles/fonts" "${publicDir}/css/fonts"`);
cmd(`cp -r "content/images" "${publicDir}/images"`);
cmd(`cp "content/favicon.ico" "${publicDir}/favicon.ico"`);
cmd(`cp "content/resume.pdf" "${publicDir}/resume.pdf"`);
cmd(`cp "app/frontend/manifest.json" "${publicDir}/manifest.json"`);

logWarn("Deleting the build directory");

cmd(`rm -rf "${buildDir}"`);

logSuccess("Build complete");
