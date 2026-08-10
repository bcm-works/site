package main

import "fmt"

func build() {
	logInfo("starting build")

	fmt.Println("pwd:", cmd("pwd"))
}
