package main

func TaskCheck() {
	LogInfo("Running Go tests")
	Cmd("cd src/cli && go test -v")

	LogInfo("Installing Deno dependencies")
	Cmd("deno task install")

	LogInfo("Running Deno code checks")
	Cmd("deno task check")

	LogInfo("Installing Go dependencies")
	Cmd("cd src/cli && go get -u -t ./...")

	LogInfo("Checking Go dependencies")
	Cmd("cd src/cli && go mod tidy")

	LogInfo("Building the site")
	TaskBuild()

	LogInfo("Running Deno tests")
	Cmd("deno task test")
}
