package main

import (
	"fmt"

	"github.com/fatih/color"
)

func Log(message string) {
	fmt.Println(message)
}

func LogInfo(message string) {
	color.Blue("%s", message)
}

func LogHighlight(message string) {
	color.Magenta("%s", message)
}

func LogSuccess(message string) {
	color.Green("Success: %s", message)
}

func LogError(message string) {
	color.Red("Error: %s", message)
}

func LogWarn(message string) {
	color.Yellow("Warning: %s", message)
}
