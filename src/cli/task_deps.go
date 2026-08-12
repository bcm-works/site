package main

func TaskDeps() {
	LogInfo("Updating Deno dependencies")
	Cmd("deno task update")

	LogInfo("Updating Go dependencies")
	Cmd("cd src/cli && go get -u -t ./... && go mod tidy")

	LogWarn("If there are Git diffs now, a CLI build then a test run must be run locally before committing and pushing changes")
}
