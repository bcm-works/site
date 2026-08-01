import { cmd } from "@/tasks/cmd.ts";
import { info, warn } from "@/tasks/log.ts";
import { loadEnv } from "@/tasks/local.ts";

loadEnv();

const buildDir: string = process.env.SITE_BUILD_DIR || "build";
const publicDir: string = process.env.SITE_PUBLIC_DIR || "public";
const cssDir: string = "src/frontend/styles";
const timezone: string = process.env.SITE_TIMEZONE || "Australia/Sydney";

warn("Clearing the build directory and recreating subdirectories");

cmd(`rm -rf "${buildDir}"`);
cmd(`mkdir -p "${buildDir}"`);
cmd(`mkdir -p "${buildDir}/_data"`);
cmd(`cp -r "src/frontend/templates" "${buildDir}/_includes"`);

warn("Clearing the public directory and recreating subdirectories");

cmd(`rm -rf "${publicDir}"`);
cmd(`mkdir -p "${publicDir}"`);
cmd(`mkdir -p "${publicDir}/css"`);

info("Applying PurgeCSS updates to site.css");

cmd(`deno x --yes --no-check --unstable-detect-cjs npm:purgecss@8.0.0 \
  --safelist ".content-body" \
  --safelist "blockquote" \
  --safelist "em" \
  --safelist "strong" \
  --css "./src/frontend/styles/site.css" \
  --content "./src/frontend/**/*.njk" \
  --output "./src/frontend/styles/site.css"`);

info("Running Deno code checks");

cmd("deno task check");

info("Copying over page content files to build directory");

cmd(`cp content/*.md "${buildDir}"`);
cmd(`cp -r content/posts "${buildDir}/posts"`);
cmd(`cp -r content/tags "${buildDir}/tags"`);

info("Building the front-end using Lume");

cmd(`TZ="${timezone}" deno task lume`);

info("Combining CSS files");

cmd(`cat "${cssDir}/reset.css" \
  "${cssDir}/theme.css" \
  "${cssDir}/app.css" \
  "${cssDir}/content.css" \
  "${cssDir}/code.css" \
  "${cssDir}/responsive.css" \
  "${cssDir}/print.css" \
  > "${buildDir}/bcm.css"`);

info("Minifying combined CSS file");

cmd(
  `deno x --yes --no-check npm:lightningcss-cli@1.32.0 \
  --minify \
  --bundle \
  --targets ">= 0.25%" "${buildDir}/bcm.css" \
  --output-file "${publicDir}/css/bcm.min.css"`,
);

info("Copying FontAwesome files to public directory");

cmd(`cp -r "src/frontend/styles/fonts" "${publicDir}/css/fonts"`);

info("Copying static files to public directory");

cmd(`cp -r "content/images" "${publicDir}/images"`);
cmd(`cp "content/favicon.ico" "${publicDir}/favicon.ico"`);
cmd(`cp "content/resume.pdf" "${publicDir}/resume.pdf"`);
cmd(`cp "src/frontend/manifest.json" "${publicDir}/manifest.json"`);
cmd(`cp "${publicDir}/posts.json" "${publicDir}/brendan/posts.json"`);

warn("Deleting the build directory");

cmd(`rm -rf "${buildDir}"`);

info("Build complete");
