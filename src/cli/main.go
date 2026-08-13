package main

import (
	"os"
)

// The main entrypoint to the cli, this function
// is called first and arguments sent to it will
// be available here directly.
func main() {
	args := os.Args

	if len(args) == 1 {
		// The first argument is this file's name, so having
		// only one argument means no other arguments were included.
		ShowHelp()
	}

	// Get the value of the first argument.
	arg := args[1]

	// Call the relevant function from the other Go
	// files in this dir based on the argument value.
	switch arg {
	case "build":
		TaskBuild()
	case "setup":
		TaskSetup()
	case "start":
		TaskStart()
	case "check":
		TaskCheck()
	case "test":
		TaskCheck()
	case "tests":
		TaskCheck()
	case "deps":
		TaskDeps()
	case "help":
		ShowHelp()
	case "list":
		ShowHelp()
	default:
		ShowHelp()
	}
}

// Displays content describing the tool and the available commands.
func ShowHelp() {
	Log(" ")

	LogHighlight("bcm-site CLI \n")

	Log("Command line interface for dev tools in the bcm-site project.")
	Log("View the public repository on GitHub at https://github.com/bcm-works/site \n")

	LogHighlight("Usage \n")

	LogInfo("Initial environment setup.")
	Log("./task setup")
	Log(" ")

	LogInfo("Build the site.")
	Log("./task build")
	Log(" ")

	LogInfo("Run tests.")
	Log("./task check")
	Log("./task test")
	Log("./task tests")
	Log(" ")

	LogInfo("Start the web server.")
	Log("./task start")
	Log(" ")

	LogInfo("Update Deno dependencies and commit the results.")
	Log("./task deps")
	Log(" ")

	LogInfo("Build the 'task' binary using Go Build.")
	Log("bash ./src/cli/build.sh")
	Log(" ")

	LogInfo("Show this help message.")
	Log("./task help")
	Log("./task list")
	Log("./task")
	Log(" ")

	os.Exit(1)
}
