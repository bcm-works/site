package main

import (
	"fmt"
)

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
	LogWarn(fmt.Sprintf("Clearing the build (./%[1]s) and public (./%[2]s) directories", build, public))

	FsDeleteDir(buildDir)
	FsMakeDir(buildDir)
	FsMakeDir(buildDir + "/_data")

	FsDeleteDir(publicDir)
	FsMakeDir(publicDir)
	FsMakeDir(publicDir + "/css")

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

	FsCopyDir(contentDir, buildDir)
	FsCopyDir(fmt.Sprintf("%s/templates", frontendDir), fmt.Sprintf("%s/_includes", buildDir))

	LogInfo("Building the front-end using Lume")

	Cmd("deno task lume-build")

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

	FsCopyDir(cssDir+"/fonts", publicDir+"/css/fonts")

	FsCopyDir(frontendDir+"/scripts", publicDir+"/scripts")
	FsCopyFile(frontendDir+"/manifest.json", publicDir+"/manifest.json")

	// LogWarn("Deleting the build directory")
	// FsDeleteDir(buildDir)

	LogSuccess("Public files ready in " + publicDir)
}
