import { execSync as run } from "node:child_process";
import { info, warn } from "@/tools/log.ts";
import { loadEnv } from "@/tools/env.ts";

loadEnv();

const buildDir: string = process.env.SITE_BUILD_DIR || "build";
const publicDir: string = process.env.SITE_PUBLIC_DIR || "public";
const cssDir: string = "src/frontend/styles";
const timezone: string = process.env.SITE_TIMEZONE || "Australia/Sydney";

// Clear out and recreate the Build and Public directories

warn("Clearing the build directory and recreating subdirectories");

run(`rm -rf "${buildDir}"`);
run(`mkdir -p "${buildDir}"`);
run(`mkdir -p "${buildDir}/_data"`);
run(`cp -r "src/frontend/templates" "${buildDir}/_includes"`);

warn("Clearing the public directory and recreating subdirectories");

run(`rm -rf "${publicDir}"`);
run(`mkdir -p "${publicDir}"`);
run(`mkdir -p "${publicDir}/css"`);

info("Applying PurgeCSS updates to site.css");

run(`deno x --yes --no-check --unstable-detect-cjs npm:purgecss@8.0.0 \
  --safelist ".content-body" \
  --safelist "blockquote" \
  --safelist "em" \
  --safelist "strong" \
  --css "./src/frontend/styles/site.css" \
  --content "./src/frontend/**/*.njk" \
  --output "./src/frontend/styles/site.css"`);

info("Running Deno Lint");

run("deno task lint", { stdio: "inherit" });

info("Copying over page content files to build directory");

run(`cp content/*.md "${buildDir}"`);
run(`cp -r content/posts "${buildDir}/posts"`);
run(`cp -r content/tags "${buildDir}/tags"`);

info("Building the front-end using Lume");

run(`TZ="${timezone}" deno task lume`, { stdio: "inherit" });

info("Combining CSS files");

run(`cat "${cssDir}/reset.css" \
  "${cssDir}/theme.css" \
  "${cssDir}/app.css" \
  "${cssDir}/content.css" \
  "${cssDir}/code.css" \
  "${cssDir}/responsive.css" \
  "${cssDir}/print.css" \
  > "${buildDir}/bcm.css"`);

info("Minifying combined CSS file");

run(
  `deno x --yes --no-check npm:lightningcss-cli@1.32.0 \
  --minify \
  --bundle \
  --targets ">= 0.25%" "${buildDir}/bcm.css" \
  --output-file "${publicDir}/css/bcm.min.css"`,
  { stdio: "inherit" },
);

info("Copying FontAwesome files to public directory");

run(`cp -r "src/frontend/styles/fonts" "${publicDir}/css/fonts"`);

info("Copying static files to public directory");

run(`cp -r "content/images" "${publicDir}/images"`);
run(`cp "content/favicon.ico" "${publicDir}/favicon.ico"`);
run(`cp "content/resume.pdf" "${publicDir}/resume.pdf"`);
run(`cp "src/frontend/manifest.json" "${publicDir}/manifest.json"`);
run(`cp "${publicDir}/posts.json" "${publicDir}/brendan/posts.json"`);

info("Build complete");
