package main

import "fmt"

var buildDir = envGet("SITE_BUILD_DIR", "build")
var publicDir = envGet("SITE_PUBLIC_DIR", "public")
var cssDir = "src/frontend/styles"
var timezone = envGet("SITE_TIMEZONE", "Australia/Sydney")
var url = envGet("SITE_URL", "")

func build() {
	logInfo("starting build")

	logInfo("buildDir: " + buildDir)
	logInfo("publicDir: " + publicDir)
	logInfo("cssDir: " + cssDir)
	logInfo("timezone: " + timezone)
	logInfo("url: " + url)

	fmt.Println("pwd:", cmdResult("pwd"))
}
