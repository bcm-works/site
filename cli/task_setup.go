package main

import "os"

func TaskSetup() {
	if !FsCommandExists("asdf") {
		LogError("Please install ASDF first - https://asdf-vm.com/")

		os.Exit(1)
	}

	LogInfo("Configuring ASDF")

	Cmd("asdf plugin add deno https://github.com/asdf-community/asdf-deno.git")
	Cmd("asdf plugin add golang https://github.com/asdf-community/asdf-golang.git")
	Cmd("asdf install")

	LogInfo("Initialising ENV file")
	if !FsExists(".env") {
		FsCopyFile(".env.example", ".env")
	}

	LogInfo("Installing Deno dependencies")
	DenoTask("install")

	LogInfo("Installing Go dependencies")
	GoCmd("mod download")

	LogSuccess("Setup completed")
}
