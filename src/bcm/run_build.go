package main

import "fmt"

var build = EnvGet("SITE_BUILD_DIR", "build")
var buildDir = DirGet(build)
var public = EnvGet("SITE_PUBLIC_DIR", "public")
var publicDir = DirGet(public)
var content = "content"
var contentDir = DirGet(content)
var frontendDir = DirGet("src/frontend")
var cssDir = DirGet("src/frontend/styles")

var timezone = EnvGet("SITE_TIMEZONE", "Australia/Sydney")
var url = EnvGet("SITE_URL", "http://localhost")

func RunBuild() {
	LogWarn(fmt.Sprintf("Clearing the build (%[1]s) and public (%[2]s) directories", buildDir, publicDir))

	FsSoftDelete(buildDir)
	FsMakeDir(buildDir)
	FsMakeDir(fmt.Sprintf("%s/_data", buildDir))

	FsSoftDelete(publicDir)
	FsMakeDir(publicDir)
	FsMakeDir(fmt.Sprintf("%s/css", publicDir))

	LogInfo("Applying PurgeCSS updates to site.css")

	Cmd(fmt.Sprintf(`deno --quiet x --yes --no-check --unstable-detect-cjs npm:purgecss@8.0.0 \
    --safelist ".content-body" \
    --safelist "blockquote" \
    --safelist "em" \
    --safelist "strong" \
    --css %[1]s/site.css \
    --content %[2]s/**/*.njk \
    --output %[1]s/site.css`, cssDir, frontendDir))

	LogInfo("Running Deno code checks")

	Cmd("deno task check")

	LogInfo("Copying over page content and templates to the build directory")

	FsCopy(contentDir, buildDir)
	FsCopy(fmt.Sprintf("%s/templates", frontendDir), fmt.Sprintf("%s/_includes", buildDir))

	LogInfo("Building the front-end using Lume")

	Cmd(fmt.Sprintf(`TZ="%[1]s" LUME_LOGS=error deno --quiet task lume \
  --src=%[2]s \
  --dest=%[3]s \
  --location="%[4]s"`, timezone, build, public, url))

	LogInfo("Combining and minifying CSS")

	Cmd(fmt.Sprintf(`cat "%[1]s/reset.css" \
    "%[1]s/theme.css" \
    "%[1]s/animations.css" \
    "%[1]s/layout.css" \
    "%[1]s/content.css" \
    "%[1]s/code.css" \
    "%[1]s/screen-small.css" \
    "%[1]s/print.css" \
  > "%[2]s/bcm.css"`, cssDir, buildDir))

	Cmd(fmt.Sprintf(`deno --quiet x --yes --no-check npm:lightningcss-cli@1.32.0 \
  --minify \
  --bundle \
  --targets ">= 0.25%%"  "%[1]s/bcm.css" \
  --output-file "%[2]s/css/bcm.min.css"`, buildDir, publicDir))

	LogInfo("Copying static files to the public directory")

	FsCopy(fmt.Sprintf("%s/fonts", cssDir), fmt.Sprintf("%s/css/fonts", publicDir))

	FsCopy(fmt.Sprintf("%s/scripts", frontendDir), fmt.Sprintf("%s/scripts", publicDir))
	FsCopy(fmt.Sprintf("%s/manifest.json", frontendDir), fmt.Sprintf("%s/manifest.json", publicDir))

	LogWarn("Deleting the build directory")

	FsSoftDelete(buildDir)

	LogSuccess(fmt.Sprintf("Public files ready in %s", publicDir))
}
