package main

func TaskStart() {
	LogInfo("Installing dependencies")
	Cmd("deno task install")

	LogInfo("Building the site")
	TaskBuild()

	LogInfo("Starting the webserver")
	Cmd("deno task serve")
}
