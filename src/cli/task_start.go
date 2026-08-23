package main

func TaskStart() {
	LogInfo("Installing dependencies")
	Cmd("deno task install")

	LogInfo("Building the site")
	TaskBuild()

	LogInfo("Starting the webserver at " + EnvGetUrl())
	Cmd("deno task serve")
}
