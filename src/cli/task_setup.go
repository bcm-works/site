package main

func TaskSetup() {
	LogInfo("Initialising ENV file")

	if !FsExists("config/.env") {
		FsCopyFile("config/.env.example", "config/.env")
	}

	LogInfo("Installing dependencies")
	Cmd("deno task install")

	LogWarn("Optional: Setup GitHub CLI - https://github.com/bcm-works/dotfiles/blob/main/setup/dev/git/github-setup.sh")

	LogWarn("Optional: Setup AI tools - https://github.com/bcm-works/dotfiles/tree/main/ai")

	LogSuccess("Setup completed")
}
