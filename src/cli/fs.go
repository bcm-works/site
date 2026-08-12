package main

import (
	"errors"
	"fmt"
	"io"
	"io/fs"
	"os"

	"github.com/joho/godotenv"
)

// Get the value of an environment variable value,
// return an optional default value, or return an empty string.
func EnvGet(varName string, defaultValue ...string) string {
	// Get the system env var value for this var name
	envValue := os.Getenv(varName)

	// Load the env vars from the file "/config/.env"
	env, err := godotenv.Read("../../config/.env")

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

// Get the full path to the current directory,
// with an optional subdirectory to add to the output.
func DirGet(subDir ...string) string {
	dir, err := os.Getwd()

	if err != nil {
		LogError(fmt.Sprintf("DirGet error: %s", err.Error()))
		return ""
	}

	if len(subDir) > 0 {
		dir = fmt.Sprintf("%[1]s/%[2]s", dir, subDir[0])
	}

	return dir
}

// Copy a file to another location.
func FsCopyFile(src string, dst string) {
	srcFile, err := os.Open(src)

	if err != nil {
		LogError(err.Error())
	}

	defer srcFile.Close()

	dstFile, err := os.Create(dst)

	if err != nil {
		LogError(err.Error())
	}

	defer dstFile.Close()

	_, err = io.Copy(dstFile, srcFile)

	if err != nil {
		LogError(err.Error())
	}
}

// Copy a directory to another location.
func FsCopyDir(src string, dst string) {
	entries, err := os.ReadDir(src)

	if err != nil {
		LogError(err.Error())
	}

	for _, entry := range entries {
		srcPath := fmt.Sprintf("%s/%s", src, entry.Name())
		dstPath := fmt.Sprintf("%s/%s", dst, entry.Name())

		if entry.IsDir() {
			FsCopyDir(srcPath, dstPath)
		} else {
			FsCopyFile(srcPath, dstPath)
		}
	}
}

// Check if a directory exists or not.
func FsDirExists(path string) bool {
	_, err := os.Stat(path)

	if err == nil {
		return true
	}

	if errors.Is(err, fs.ErrNotExist) {
		return false
	}

	return false
}

// Make a new directory if it doesn't already exist.
func FsMakeDir(path string) {
	exists := FsDirExists(path)

	if !exists {
		err := os.Mkdir(path, 0755)

		if err != nil {
			LogError(err.Error())
		}
	}
}

// Delete a directory and all its contents.
func FsDeleteDir(path string) {
	exists := FsDirExists(path)

	if exists {
		err := os.RemoveAll(path)

		if err != nil {
			LogError(err.Error())
		}
	}
}
