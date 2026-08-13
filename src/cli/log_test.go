package main

import "testing"

func TestLog(t *testing.T) {
	expected := "Test log message"

	defer saveStdout(t)()
	r, w := captureStdout(t)

	Log(expected)

	received := readCaptured(w, r)

	if !BufferEqualsString(received, expected) {
		t.Errorf("Expecting '%[1]s', got '%[2]q'", expected, received.String())
	}
}
