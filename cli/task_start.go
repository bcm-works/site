package main

func TaskStart() {
	LogInfo("Installing dependencies")
	DenoTask("install")

	LogInfo("Building the site")
	TaskBuild()

	LogSuccess("Server starting at " + EnvGetUrl())
	DenoTask("serve")
}
