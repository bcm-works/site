package main

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
)

// Run a system command and display the output or error.
func Cmd(command string) {
	cmd := exec.Command("bash", "-c", command)
	output, err := cmd.CombinedOutput()

	if err != nil {
		LogError(fmt.Sprintf("Cmd Error: %s", err.Error()))
		os.Exit(1)
	}

	out := strings.TrimSpace(string(output))
	if out != "" {
		Log(out)
	}
}

func ShowHelp() {
	Log(" ")

	LogHighlight("bcm-site CLI \n")

	Log("Command line interface for dev tools in the bcm-site project.")
	Log("View the public repository on GitHub at https://github.com/bcm-works/site \n")

	LogHighlight("Usage \n")

	LogInfo("Show this help message.")
	Log("./task help")
	Log("./task list")
	Log("./task")
	Log(" ")

	LogInfo("Build the site.")
	Log("./task build")
	Log(" ")

	LogInfo("Build the 'task' binary using Go Build.")
	Log("bash ./src/cli/build.sh")
	Log(" ")

	os.Exit(1)
}

// The main entrypoint to the cli, this is the
// function that is triggered when an arg is sent to
// the built version of this package.
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
	// files in this dir based on the argument.
	switch arg {
	case "build":
		RunBuild()
	case "help":
		ShowHelp()
	case "list":
		ShowHelp()
	default:
		ShowHelp()
	}
}
