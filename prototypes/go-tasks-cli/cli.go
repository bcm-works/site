package main

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/fatih/color"
	"github.com/joho/godotenv"
)

func Log(message string) {
	fmt.Println(message)
}

func LogInfo(message string) {
	color.Blue("i %s", message)
}

func LogSuccess(message string) {
	color.Green("✓ %s", message)
}

func LogError(message string) {
	color.Red("✗ %s", message)
}

func LogWarning(message string) {
	color.Yellow("! %s", message)
}

// Load a variable from the env file, with an optional default value
func EnvGet(var_name string, default_value ...string) string {
	env, err := godotenv.Read("../../config/.env")

	if err != nil {
		LogError("failed to load .env file")
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
func Cmd(command string) {
	cmd := exec.Command("sh", "-c", command)
	_, err := cmd.Output()

	if err != nil {
		LogError(err.Error())
		return
	}
}

// Run a system command and return the output
func CmdResult(command string) string {
	cmd := exec.Command("sh", "-c", command)
	out, err := cmd.Output()

	if err != nil {
		return err.Error()
	}

	return string(out)
}

func main() {
	args := os.Args

	if len(args) == 1 {
		// As the first argument is this file's name,
		// one argument means there were no provided arguments.
		fmt.Println("no args provided")
		os.Exit(1)
	}

	// Get the value of the first argument.
	arg := args[1]

	// Call the relevant function from the other Go
	// files in this dir based on the argument.
	switch arg {
	case "build":
		RunBuild()
	default:
		fmt.Println("unknown command", arg)
		os.Exit(1)
	}
}
