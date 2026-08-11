package main

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/joho/godotenv"
)

// Get the full path to the current directory,
// with an optional subdirectory to add to the output.
func DirGet(subDir ...string) string {
	dir, err := os.Getwd()

	if err != nil {
		LogError(fmt.Sprintf("DirGet error: %s", err.Error()))
		return ""
	}

	if len(subDir) > 0 {
		dir = fmt.Sprintf("%s/%s", dir, subDir[0])
	}

	return dir
}

// Get an environment variable value, or return
// an optional default value.
func EnvGet(varName string, defaultValue ...string) string {
	// Get the system env var value for this var name
	envValue := os.Getenv(varName)

	// Load the env vars from the file "./.env"
	env, err := godotenv.Read(".env")

	// If the env file was loaded successfully, use that variable's value
	if err == nil {
		envValue = env[varName]
	}

	// If the env var is still empty, use the default value if provided
	if envValue == "" {
		if len(defaultValue) > 0 {
			return defaultValue[0]
		} else {
			return ""
		}
	}

	return envValue
}

// Run a system command and display the output or error.
func Cmd(command string) {
	cmd := exec.Command("bash", "-c", command)

	// Start the process asynchronously exactly once
	if errStart := cmd.Start(); errStart != nil {
		LogError(fmt.Sprintf("Cmd Run Error: %s", errStart.Error()))
		os.Exit(1)
	}

	// Wait for it to complete exactly once
	if errFinish := cmd.Wait(); errFinish != nil {
		LogError(fmt.Sprintf("Cmd Finish Error: %s", errFinish.Error()))
		os.Exit(1)
	}

	output, errOutput := cmd.Output()

	if errOutput != nil {
		LogError(fmt.Sprintf("Cmd Output Error: %s", errOutput.Error()))
		os.Exit(1)
	}

	Log(string(output))
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
	default:
		ShowHelp()
	}
}
