package main

import (
	"bytes"
	"io"
	"os"
	"testing"
)

func TestLog(t *testing.T) {
	expected := "Test log message"

	// Save the original stdout, restore that after this test finishes.
	oldStdout := os.Stdout
	defer func() { os.Stdout = oldStdout }()

	// Capture the stdout stream.
	r, w, _ := os.Pipe()
	os.Stdout = w

	// Trigger the function to test.
	Log(expected)

	// Read the captured bytes.
	w.Close()
	var received bytes.Buffer
	io.Copy(&received, r)

	// Fail the test if the output is incorrect.
	if TestConfirmWithBuffer(received, expected) {
		t.Errorf("Expecting '%[1]s', got '%[2]q'", expected, received.String())
	}
}
