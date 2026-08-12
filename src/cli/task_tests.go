package main

func TaskTests() {
	LogInfo("Installing dependencies")
	Cmd("deno task install")

	LogInfo("Building the site")
	TaskBuild()

	LogInfo("Running tests")
	Cmd("deno task test")
}
