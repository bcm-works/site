package main

func TaskDeps() {
	LogInfo("Updating Deno dependencies")
	DenoTask("update")

	LogInfo("Updating Go dependencies")
	GoCmd("get -u -t ./...")
	GoCmd("mod tidy")

	LogWarn("Finished dependency updates, check updated files")
}
