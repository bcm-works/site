package main

func TaskCheck() {
	LogInfo("Running Go tests")
	Cmd("cd src/cli && go test -v")

	LogInfo("Installing Deno dependencies")
	Cmd("deno task install")

	LogInfo("Building the site")
	TaskBuild()

	LogInfo("Running Deno tests")
	Cmd("deno task test")
}
