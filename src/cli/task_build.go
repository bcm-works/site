package main

func TaskBuild() {
	LogInfo("Starting the site build proccess")
	Cmd("deno task build")
}
