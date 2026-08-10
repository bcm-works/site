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
	// Get the arguments sent to this, but ignore the first argument,
	// which is this file's name.
	args := os.Args[1:]

	fmt.Println("all args", args)

	if len(args) > 0 {
		arg := args[0]
		fmt.Println("arg 1", arg)
	}
}
