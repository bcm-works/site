package main

func TaskStart() {
	LogInfo("Installing dependencies")
	Cmd("deno task install")

	LogInfo("Building the site")
	TaskBuild()

	LogInfo("Server starting at " + EnvGetUrl())
	Cmd("deno task serve")
}
