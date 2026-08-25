package main

func TaskSetup() {
	LogInfo("Initialising ENV file")

	if !FsExists(".env") {
		FsCopyFile(".env.example", ".env")
	}

	LogInfo("Installing Deno dependencies")
	Cmd("deno task install")

	LogInfo("Installing Go dependencies")
	Cmd("cd src/cli && go mod download")

	LogSuccess("Setup completed")
}
