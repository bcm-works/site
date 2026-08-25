package main

func TaskSetup() {
	LogInfo("Initialising ENV file")

	if !FsExists(".env") {
		FsCopyFile(".env.example", ".env")
	}

	LogInfo("Installing dependencies")
	Cmd("deno task install")

	LogSuccess("Setup completed")
}
