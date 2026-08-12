package main

import (
	"fmt"

	"github.com/fatih/color"
)

func Log(message string) {
	fmt.Println(message)
}

func LogInfo(message string) {
	color.Blue("i %s", message)
}

func LogDebug(message string) {
	color.Cyan("> %s", message)
}

func LogHighlight(message string) {
	color.Magenta("%s", message)
}

func LogSuccess(message string) {
	color.Green("✔ %s", message)
}

func LogError(message string) {
	color.Red("✗ %s", message)
}

func LogWarn(message string) {
	color.Yellow("! %s", message)
}
