package main

func TaskSetup() {
	LogInfo("Initialising ENV file")

	if !FsExists(".env") {
		FsCopyFile(".env.example", ".env")
	}

	LogInfo("Installing dependencies")
	Cmd("deno task install")

	LogWarn("Optional: Setup GitHub CLI - https://github.com/bcm-works/dotfiles/blob/main/dev/git/github-setup.sh")

	LogWarn("Optional: Setup AI tools - https://github.com/bcm-works/dotfiles/tree/main/ai")

	LogSuccess("Setup completed")
}
