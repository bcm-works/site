package main

import (
	"fmt"
	"os"
	"os/exec"

	"github.com/urfave/cli"
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
	app := cli.NewApp()
	app.Name = "tasks-cli"
	app.UsageText = "tasks [arg]"
	app.Author = "Brendan Murty"
	app.Email = "brendan@bcm.works"

	app.Action = func(c *cli.Context) error {
		arg := c.Args().Get(0)

		// if arg == "" {
		// TODO: show usage output, then return nil
		// }

		fmt.Println("arg: " + arg)

		pwd := cmd("pwd")
		fmt.Println("pwd: " + pwd)

		return nil
	}

	app.Run(os.Args)
}
