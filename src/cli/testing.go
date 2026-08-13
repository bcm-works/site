package main

import (
	"bytes"
	"io"
	"os"
	"strings"
	"testing"
)

// Check if the trimmed value from a buffer matches a string value.
func BufferEqualsString(received bytes.Buffer, expected string) bool {
	receivedStr := strings.Trim(received.String(), "\n")

	return strings.Compare(expected, receivedStr) == 0
}

// saveStdout saves os.Stdout and returns a function that restores it.
func saveStdout(t *testing.T) func() {
	t.Helper()
	old := os.Stdout
	return func() { os.Stdout = old }
}

// captureStdout redirects os.Stdout to a new pipe and returns the read/write ends.
func captureStdout(t *testing.T) (r, w *os.File) {
	t.Helper()
	var err error
	r, w, err = os.Pipe()
	if err != nil {
		t.Fatalf("captureStdout: %v", err)
	}
	os.Stdout = w
	return r, w
}

// readCaptured closes the write end of the pipe and reads all output into a buffer.
func readCaptured(w, r *os.File) bytes.Buffer {
	w.Close()
	var buf bytes.Buffer
	io.Copy(&buf, r)
	return buf
}
