package main

import "fmt"

var buildDir = EnvGet("SITE_BUILD_DIR", "build")
var publicDir = EnvGet("SITE_PUBLIC_DIR", "public")
var cssDir = "src/frontend/styles"
var timezone = EnvGet("SITE_TIMEZONE", "Australia/Sydney")
var url = EnvGet("SITE_URL", "")

func RunBuild() {
	LogWarn(fmt.Sprintf("Clearing the build (./%[1]s) and public (./%[2]s) directories", buildDir, publicDir))

	Cmd(fmt.Sprintf("rm -rf %s", buildDir))
	Cmd(fmt.Sprintf("mkdir -p %s", buildDir))
	Cmd(fmt.Sprintf("mkdir -p %s/_data", buildDir))
	Cmd("cp -r src/frontend/templates build/_includes")

	Cmd(fmt.Sprintf("rm -rf %s", publicDir))
	Cmd(fmt.Sprintf("mkdir -p %s", publicDir))
	Cmd(fmt.Sprintf("mkdir -p %s/css", publicDir))

	LogInfo("Applying PurgeCSS updates to site.css")

	Cmd(`deno --quiet x --yes --no-check --unstable-detect-cjs npm:purgecss@8.0.0
    --safelist ".content-body"
    --safelist "blockquote"
    --safelist "em"
    --safelist "strong"
    --css "./src/frontend/styles/site.css"
    --content "./src/frontend/**/*.njk"
    --output "./src/frontend/styles/site.css"`)

	LogInfo("Running Deno code checks")

	CmdShow("deno task check")

	LogInfo("Copying over page content files to build directory")

	Cmd(fmt.Sprintf("cp content/*.md %s", buildDir))
	Cmd(fmt.Sprintf("cp -r content/posts %s/posts", buildDir))
	Cmd(fmt.Sprintf("cp -r content/tags %s/tags", buildDir))

	LogInfo("Building the front-end using Lume")

	CmdShow(`TZ="${timezone}"
    LUME_LOGS=error
    deno --quiet task lume
      --src=${buildDir}
      --dest=${publicDir}
      --location=${url}`)

	LogInfo("Combining and minifying CSS")

	Cmd(fmt.Sprintf(`cat "%[1]s/reset.css"
    "%[1]s/theme.css"
    "%[1]s/animations.css"
    "%[1]s/layout.css"
    "%[1]s/content.css"
    "%[1]s/code.css"
    "%[1]s/screen-small.css"
    "%[1]s/print.css"
  > "%[2]s/bcm.css"`, cssDir, buildDir))

	CmdShow(fmt.Sprintf(`deno --quiet x --yes --no-check npm:lightningcss-cli@1.32.0
  --minify
  --bundle
  --targets ">= 0.25%%"  "%[1]s/bcm.css"
  --output-file "%[2]s/css/bcm.min.css"`, buildDir, publicDir))

	LogInfo("Copying static files to the public directory")

	Cmd(fmt.Sprintf("cp -r %[1]s/fonts %[2]s/css/fonts", cssDir, publicDir))
	Cmd(fmt.Sprintf("cp -r content/images %s/images", publicDir))
	Cmd(fmt.Sprintf("cp content/favicon.ico %s/favicon.ico", publicDir))
	Cmd(fmt.Sprintf("cp content/resume.pdf %s/resume.pdf", publicDir))
	Cmd(fmt.Sprintf("cp -r %[1]s/scripts %[2]s/scripts", publicDir, publicDir))
	Cmd(fmt.Sprintf("cp %[1]s/manifest.json %[2]s/manifest.json", publicDir, publicDir))

	LogWarn("Deleting the build directory")

	Cmd(fmt.Sprintf("rm -rf %s", buildDir))

	LogInfo("Build complete")
}
