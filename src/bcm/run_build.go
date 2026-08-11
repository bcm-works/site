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

	Cmd(fmt.Sprintf("rm -rf %s", buildDir))
	Cmd(fmt.Sprintf("mkdir -p %s", buildDir))
	Cmd(fmt.Sprintf("mkdir -p %s/_data", buildDir))
	Cmd(fmt.Sprintf("cp -r %[1]s/templates %[2]s/_includes", frontendDir, buildDir))

	Cmd(fmt.Sprintf("rm -rf %s", publicDir))
	Cmd(fmt.Sprintf("mkdir -p %s", publicDir))
	Cmd(fmt.Sprintf("mkdir -p %s/css", publicDir))

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

	LogInfo("Copying over page content files to build directory")

	Cmd(fmt.Sprintf("cp %[1]s/*.md %[2]s", contentDir, buildDir))
	Cmd(fmt.Sprintf("cp -r %[1]s/posts %[2]s/posts", contentDir, buildDir))
	Cmd(fmt.Sprintf("cp -r %[1]s/tags %[2]s/tags", contentDir, buildDir))

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

	Cmd(fmt.Sprintf("cp -r %[1]s/fonts %[2]s/css/fonts", cssDir, publicDir))
	Cmd(fmt.Sprintf("cp -r %[1]s/images %[2]s/images", contentDir, publicDir))
	Cmd(fmt.Sprintf("cp %[1]s/favicon.ico %[2]s/favicon.ico", contentDir, publicDir))
	Cmd(fmt.Sprintf("cp %[1]s/resume.pdf %[2]s/resume.pdf", contentDir, publicDir))
	Cmd(fmt.Sprintf("cp -r %[1]s/scripts %[2]s/scripts", frontendDir, publicDir))
	Cmd(fmt.Sprintf("cp %[1]s/manifest.json %[2]s/manifest.json", frontendDir, publicDir))

	LogWarn("Deleting the build directory")

	Cmd(fmt.Sprintf("rm -rf %s", buildDir))

	LogInfo(fmt.Sprintf("Public files ready in %s", publicDir))
}
