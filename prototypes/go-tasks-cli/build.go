package main

import "fmt"

var buildDir = EnvGet("SITE_BUILD_DIR", "build")
var publicDir = EnvGet("SITE_PUBLIC_DIR", "public")
var cssDir = "src/frontend/styles"
var timezone = EnvGet("SITE_TIMEZONE", "Australia/Sydney")
var url = EnvGet("SITE_URL", "")

func RunBuild() {
	LogInfo("starting build")

	LogInfo("buildDir: " + buildDir)
	LogInfo("publicDir: " + publicDir)
	LogInfo("cssDir: " + cssDir)
	LogInfo("timezone: " + timezone)
	LogInfo("url: " + url)

	fmt.Println("pwd:", CmdResult("pwd"))
}
