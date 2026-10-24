package main

func TaskBuild() {
	LogInfo("Starting build proccess")

	DenoTask("build")

	LogSuccess("Finished build process")
}
