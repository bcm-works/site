package main

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/fatih/color"
	"github.com/joho/godotenv"
)

func log(message string) {
	fmt.Println(message)
}

func logInfo(message string) {
	color.Blue("i %s", message)
}

func logSuccess(message string) {
	color.Green("✓ %s", message)
}

func logError(message string) {
	color.Red("✗ %s", message)
}

func logWarning(message string) {
	color.Yellow("! %s", message)
}

// Load a variable from the env file, with an optional default value
func envGet(var_name string, default_value ...string) string {
	env, err := godotenv.Read("../../config/.env")

	if err != nil {
		logError("failed to load .env file")
	}

	env_value := env[var_name]

	if env_value == "" {
		if len(default_value) > 0 {
			env_value = default_value[0]
		} else {
			env_value = ""
		}
	}

	return env_value
}

// Run a system command, ignore output, but show
// error message if it fails.
func cmd(command string) {
	cmd := exec.Command("sh", "-c", command)
	_, err := cmd.Output()

	if err != nil {
		logError(err.Error())
		return
	}
}

// Run a system command and return the output
func cmdResult(command string) string {
	cmd := exec.Command("sh", "-c", command)
	out, err := cmd.Output()

	if err != nil {
		return err.Error()
	}

	return string(out)
}

func main() {
	// Get all arguments sent to this script, ignoring
	// the first argument, which is this file's name.
	args := os.Args[1:]

	if len(args) == 0 {
		fmt.Println("no args provided")
		os.Exit(1)
	}

	// Get the value of the first argument.
	arg := args[0]

	// Call the relevant function from the other Go
	// files in this dir based on the argument.
	switch arg {
	case "build":
		build()
	default:
		fmt.Println("unknown command", arg)
		os.Exit(1)
	}
}
