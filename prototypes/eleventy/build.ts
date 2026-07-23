import { execSync as run } from 'node:child_process';
import { info, warn } from '../../tools/log.ts';
import { loadEnv } from '../../tools/env.ts';

loadEnv();

const publicDir: string = process.env.SITE_PUBLIC_DIR || "public";
const cssDir: string = "src/styles";

// Clear out and recreate the Public directory

warn("Clearing the public directory and recreating subdirectories");

run(`rm -rf "${publicDir}"`);
run(`mkdir -p "${publicDir}/css"`);

info("Applying PurgeCSS updates to site.css");

run(`deno x --yes --no-check npm:purgecss@8.0.0 \
  --safelist ".content-body" \
  --safelist "blockquote" \
  --safelist "em" \
  --safelist "strong" \
  --css "./src/styles/site.css" \
  --content "./src/**/*.njk" \
  --output "./src/styles/site.css"`);

info("Combining CSS files");

run(`cat "${cssDir}/reset.css" \
  "${cssDir}/theme.css" \
  "${cssDir}/app.css" \
  "${cssDir}/content.css" \
  "${cssDir}/code.css" \
  "${cssDir}/responsive.css" \
  "${cssDir}/print.css" \
  > "${publicDir}/css/bcm.css"`);

info("Minifying combined CSS file");

run(`deno x --yes --no-check npm:lightningcss-cli@1.32.0 \
  --minify \
  --bundle \
  --targets ">= 0.25%" "${publicDir}/css/bcm.css" \
  --output-file "${publicDir}/css/bcm.min.css"`, { stdio: 'inherit' });

info("Build complete");
