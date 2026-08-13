package main

import (
	"testing"
)

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

func TestLogInfo(t *testing.T) {
	const msg = "info message"
	r, w := captureColorOutput(t)
	LogInfo(msg)
	received := readCaptured(w, r)
	if !BufferEqualsString(received, "i "+msg) {
		t.Errorf("Expecting 'i %[1]s', got '%[2]q'", msg, received.String())
	}
}

func TestLogDebug(t *testing.T) {
	const msg = "debug message"
	r, w := captureColorOutput(t)
	LogDebug(msg)
	received := readCaptured(w, r)
	if !BufferEqualsString(received, "> "+msg) {
		t.Errorf("Expecting '> %[1]s', got '%[2]q'", msg, received.String())
	}
}

func TestLogHighlight(t *testing.T) {
	const msg = "highlight message"
	r, w := captureColorOutput(t)
	LogHighlight(msg)
	received := readCaptured(w, r)
	if !BufferEqualsString(received, msg) {
		t.Errorf("Expecting '%[1]s', got '%[2]q'", msg, received.String())
	}
}

func TestLogSuccess(t *testing.T) {
	const msg = "success message"
	r, w := captureColorOutput(t)
	LogSuccess(msg)
	received := readCaptured(w, r)
	if !BufferEqualsString(received, "✔ "+msg) {
		t.Errorf("Expecting '✔ %[1]s', got '%[2]q'", msg, received.String())
	}
}

func TestLogError(t *testing.T) {
	const msg = "error message"
	r, w := captureColorOutput(t)
	LogError(msg)
	received := readCaptured(w, r)
	if !BufferEqualsString(received, "✗ "+msg) {
		t.Errorf("Expecting '✗ %[1]s', got '%[2]q'", msg, received.String())
	}
}

func TestLogWarn(t *testing.T) {
	const msg = "warn message"
	r, w := captureColorOutput(t)
	LogWarn(msg)
	received := readCaptured(w, r)
	if !BufferEqualsString(received, "! "+msg) {
		t.Errorf("Expecting '! %[1]s', got '%[2]q'", msg, received.String())
	}
}
