package main

import (
	"os"

	"github.com/joho/godotenv"
)

// TODO: this file contains duplicated code from 'src/cli/system.go'

// Get the value of an environment variable value,
// return an optional default value, or return an empty string.
func EnvGet(varName string, defaultValue ...string) string {
	// Get the system env var value for this var name
	envValue := os.Getenv(varName)

	// Load the env vars from the file ".env"
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
