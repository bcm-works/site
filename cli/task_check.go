package main

func TaskCheck() {
	LogInfo("Running Go tests")
	GoCmd("test -v")
	LogInfo("Finished Go tests")

	LogInfo("Installing Deno dependencies")
	DenoTask("install")

	LogInfo("Running Deno code checks")
	DenoTask("check")

	LogInfo("Installing Go dependencies")
	GoCmd("get -u -t ./...")

	LogInfo("Checking Go dependencies")
	GoCmd("mod tidy")

	LogInfo("Building the site")
	TaskBuild()

	LogInfo("Running Deno tests")
	DenoTask("test")
	LogInfo("Finished Deno tests")

	LogWarn("Removing generated coverage files")
	Cmd("rm -rf .coverage")

	LogSuccess("Finished test process")
}
