package main

import (
	"errors"
	"fmt"
	"io"
	"io/fs"
	"os"
	"os/exec"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

// Run a system command and display the output or error,
// using the current working directory or the optional
// 'workingDir' path string.
func Cmd(command string, workingDir ...string) {
	var cmdDir string

	if len(workingDir) > 0 {
		cmdDir = workingDir[0]
	} else {
		cmdDir = DirGet()
	}

	cmd := exec.Command("bash", "-c", command)
	cmd.Dir = cmdDir

	output, err := cmd.CombinedOutput()

	if err != nil {
		LogError(fmt.Sprintf("Cmd Error: %s", err.Error()))
		os.Exit(1)
	}

	out := strings.TrimSpace(string(output))
	if out != "" {
		Log(out)
	}
}

// Run a Deno Task using the ASDF shim version of Deno.
func DenoTask(denoTaskName string) {
	Cmd("asdf exec deno task " + denoTaskName)
}

// Run a Go command using the ASDF shim version of Go.
func GoCmd(denoTaskName string) {
	Cmd("cd cli && asdf exec go " + denoTaskName)
}

// Run a system command with arguments and return its combined
// output, without exiting when the command fails.
func CmdOutput(command string, args ...string) (string, error) {
	cmd := exec.Command(command, args...)
	cmd.Dir = DirGet()

	output, err := cmd.CombinedOutput()

	return strings.TrimSpace(string(output)), err
}

// Run a system command with arguments, logging its output and
// exiting when the command fails.
func CmdArgs(command string, args ...string) {
	output, err := CmdOutput(command, args...)

	if err != nil {
		LogError(fmt.Sprintf("Cmd Error: %s", err.Error()))
		os.Exit(1)
	}

	if output != "" {
		Log(output)
	}
}

// Get the value of an environment variable value,
// return an optional default value, or return an empty string.
func EnvGet(varName string, defaultValue ...string) string {
	// Get the system env var value for this var name
	envValue := os.Getenv(varName)

	// Load the env vars from the file "/.env"
	env, err := godotenv.Read(".env")

	// If the env file was loaded successfully, use that variable's
	// value, while falling back to the system env var when the
	// variable is not defined in the file.
	if err == nil {
		if fileValue, ok := env[varName]; ok {
			envValue = fileValue
		}
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

// Check if this environment is local or not
func EnvIsLocal() bool {
	return EnvGet("SITE_ENV", "other") == "local"
}

// Get the URL for this environment
func EnvGetUrl() string {
	if EnvIsLocal() {
		port := strconv.Itoa(EnvGetPort())
		return "http://localhost:" + port
	}

	return EnvGet("SITE_URL", "https://bcm.works")
}

// Get the port for this environment, using appropriate
// fallback values that support both local and hosted
// environments.
func EnvGetPort() int {
	// First check for the system-level 'PORT' env var
	envPort := EnvGet("PORT", "0")
	port, err := strconv.Atoi(envPort)

	if port > 80 && err == nil {
		return port
	}

	// Now check for the 'SITE_PORT' env var from the env file
	envSitePort, err := strconv.Atoi(EnvGet("SITE_PORT", "8000"))
	if err != nil {
		return 8000
	}

	return envSitePort
}

// Get the full path to the current directory,
// with an optional subdirectory to add to the output.
func DirGet(subDir ...string) string {
	// Attempt to get the working dir.
	dir, err := os.Getwd()

	if err != nil {
		// Attempt to get the binary dir.
		cmdPath, err := os.Executable()

		// Fallback to using the current dir.
		if err != nil {
			dir = "."
		}

		// Use the binary dir.
		dir = filepath.Dir(cmdPath)
	}

	// Append the sub dir to the path if needed.
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

	FsMakeDir(dst)

	for _, entry := range entries {
		srcPath := fmt.Sprintf("%s/%s", src, entry.Name())
		dstPath := fmt.Sprintf("%s/%s", dst, entry.Name())

		if entry.IsDir() {
			FsMakeDir(dstPath)
			FsCopyDir(srcPath, dstPath)
		} else {
			FsCopyFile(srcPath, dstPath)
		}
	}
}

// Check if a file or directory exists.
func FsExists(path string) bool {
	_, err := os.Stat(path)

	if err == nil {
		return true
	}

	if errors.Is(err, fs.ErrNotExist) {
		return false
	}

	return false
}

// Check if a binary exists on the system.
func FsCommandExists(command string) bool {
	_, err := exec.LookPath(command)

	return err == nil
}

// Make a new directory if it doesn't already exist.
func FsMakeDir(path string) {
	exists := FsExists(path)

	if !exists {
		// Create directories recursively as needed
		err := os.MkdirAll(path, 0755)
		if err != nil {
			LogError(err.Error())
		}
	}
}

// Delete a directory and all its contents.
func FsDeleteDir(path string) {
	exists := FsExists(path)

	if exists {
		err := os.RemoveAll(path)

		if err != nil {
			LogError(err.Error())
		}
	}
}
