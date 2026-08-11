package main

import (
	_ "embed"
	"fmt"
	"os"
	"os/exec"

	"github.com/joho/godotenv"
)

// Use go:embed to compile the file contents directly into the binary
//
//go:embed .env
var envFileBytes []byte

// Load a variable from the env file, with an optional default value
func EnvGet(varName string, defaultValue ...string) string {
	env, err := godotenv.Unmarshal(string(envFileBytes))

	if err != nil {
		LogError(fmt.Sprintf("Failed to load .env file: %v", err))
	}

	envValue := env[varName]

	if envValue == "" {
		if len(defaultValue) > 0 {
			envValue = defaultValue[0]
		} else {
			envValue = ""
		}
	}

	return envValue
}

// Run a system command, and return both the output,
// and the error message if it fails.
func Cmd(command string) (string, string) {
	cmd := exec.Command("bash", "-c", command)
	out, err := cmd.Output()

	if err != nil {
		LogError(err.Error())
	}

	return string(out), err.Error()
}

// Run a system command and display the output
func CmdShow(command string) {
	out, error := Cmd(command)

	if error != "" {
		LogError(error)
	}

	Log(string(out))
}

func ShowHelp() {
	LogHighlight("bcm-site CLI \n")

	Log("Command line interface for dev tools in the bcm-site project.")
	Log("View the public repository on GitHub at https://github.com/bcm-works/site")

	LogInfo("\nUsage \n")

	Log(fmt.Sprintf(`- %[1]s - Show this message.
- %[1]s build - Run the site build script.
- bash %[2]s/cli.build.sh - Rebuild the '%[1]s' binary using Go Build.`,
		"./bcm",
		"./src/bcm"))

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
	case "h":
	case "list":
	case "ls":
	default:
		ShowHelp()
	}
}
