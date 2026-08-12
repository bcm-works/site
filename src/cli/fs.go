package main

import (
	"errors"
	"fmt"
	"io"
	"io/fs"
	"os"
	"time"
)

// Copy a file or directory on the local file system
// to another location.
func FsCopy(src string, dst string) {
	LogDebug(fmt.Sprintf("FsCopy %s > %s", src, dst))

	srcFileOrDir, err := os.Open(src)
	if err != nil {
		LogError(err.Error())
	}
	defer srcFileOrDir.Close()

	dstFileOrDir, err := os.Create(dst)
	if err != nil {
		LogError(err.Error())
	}
	defer dstFileOrDir.Close()

	_, err = io.Copy(dstFileOrDir, srcFileOrDir)

	if err != nil {
		LogError(err.Error())
	}
}

func FsDirExists(path string) bool {
	_, err := os.Stat(path)
	if err == nil {
		// Path exists
		return true
	}

	// Use errors.Is to explicitly catch "not found" errors
	if errors.Is(err, fs.ErrNotExist) {
		return false
	}

	// Path might exist, but we encountered another issue (e.g., permission denied)
	return false
}

func FsMakeDir(path string) {
	LogDebug(fmt.Sprintf("FsMakeDir %s", path))

	// Check if this dir already exists
	exists := FsDirExists(path)

	if !exists {
		// Create the directory as it doesn't exist yet
		err := os.Mkdir(path, 0755)
		if err != nil {
			LogError(err.Error())
		}
	}
}

func FsSoftDelete(path string) {
	now := time.Now()
	timestamp := now.Format("20060102-150405.0000")

	trash := DirGet(".trash")
	FsMakeDir(trash)

	trashpath := fmt.Sprintf("%s/%s", trash, timestamp)

	LogDebug(fmt.Sprintf("FsSoftDelete %s > %s", path, trashpath))

	err := os.Rename(path, trashpath)
	if err != nil {
		LogError(err.Error())
	}
}
