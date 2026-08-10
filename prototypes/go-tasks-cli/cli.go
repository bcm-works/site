package main

import (
	"fmt"
	"os"
	"os/exec"
)

// Run a system command and return the output
func cmd(command string) string {
	cmd := exec.Command("sh", "-c", command)
	out, err := cmd.Output()

	if err != nil {
		return err.Error()
	}

	return string(out)
}

func main() {
	// Get all arguments sent to this, ignoring the first
	// argument, which is this file's name.
	args := os.Args[1:]

	if len(args) == 0 {
		fmt.Println("no args provided")
		os.Exit(1)
	}

	// Get the first argument's text value.
	arg := args[0]

	// Handle the request by calling the functions in the
	// other Go files directly.
	switch arg {
	case "build":
		build()
	default:
		fmt.Println("unknown command", arg)
		os.Exit(1)
	}
}
