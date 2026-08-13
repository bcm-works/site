package main

import (
	"fmt"
	"os"
	"strings"
	"testing"
)

func TestDirGet(t *testing.T) {
	dir := DirGet()
	if dir == "" {
		t.Errorf("DirGet() returned empty string")
	}

	sub := DirGet("subdir")
	if !strings.HasSuffix(sub, "/subdir") {
		t.Errorf("DirGet(\"subdir\") = %q, want suffix /subdir", sub)
	}
}

func TestFsExists(t *testing.T) {
	t.Cleanup(func() { FsDeleteDir("temp") })

	if FsExists("temp/nonexistent") {
		t.Errorf("FsExists(\"temp/nonexistent\") = true, want false")
	}

	FsMakeDir("temp")
	if !FsExists("temp") {
		t.Errorf("FsExists(\"temp\") = false after creation, want true")
	}
}

func TestFsMakeDir(t *testing.T) {
	t.Cleanup(func() { FsDeleteDir("temp") })

	path := "temp/a/b/c"
	FsMakeDir(path)
	if !FsExists(path) {
		t.Errorf("FsMakeDir(%q): directory not created", path)
	}

	FsMakeDir(path)
	if !FsExists(path) {
		t.Errorf("FsMakeDir(%q): directory missing after second call", path)
	}
}

func TestFsDeleteDir(t *testing.T) {
	t.Cleanup(func() { FsDeleteDir("temp") })

	FsMakeDir("temp/todelete")
	FsDeleteDir("temp/todelete")
	if FsExists("temp/todelete") {
		t.Errorf("FsDeleteDir: directory still exists after deletion")
	}

	FsDeleteDir("temp/nonexistent")
}

func TestFsCopyFile(t *testing.T) {
	t.Cleanup(func() { FsDeleteDir("temp") })

	FsMakeDir("temp")
	src := "temp/src.txt"
	dst := "temp/dst.txt"
	content := []byte("hello copy")

	if err := os.WriteFile(src, content, 0644); err != nil {
		t.Fatalf("setup WriteFile: %v", err)
	}

	FsCopyFile(src, dst)

	got, err := os.ReadFile(dst)
	if err != nil {
		t.Errorf("ReadFile(%q): %v", dst, err)
	}
	if string(got) != string(content) {
		t.Errorf("FsCopyFile: got %q, want %q", got, content)
	}
}

func TestFsCopyDir(t *testing.T) {
	t.Cleanup(func() { FsDeleteDir("temp") })

	src := "temp/srcdir"
	dst := "temp/dstdir"
	FsMakeDir(fmt.Sprintf("%s/sub", src))

	files := map[string]string{
		fmt.Sprintf("%s/a.txt", src):     "file a",
		fmt.Sprintf("%s/sub/b.txt", src): "file b",
	}
	for path, content := range files {
		if err := os.WriteFile(path, []byte(content), 0644); err != nil {
			t.Fatalf("setup WriteFile(%q): %v", path, err)
		}
	}

	FsCopyDir(src, dst)

	for srcPath, content := range files {
		dstPath := strings.Replace(srcPath, src, dst, 1)
		got, err := os.ReadFile(dstPath)
		if err != nil {
			t.Errorf("ReadFile(%q): %v", dstPath, err)
			continue
		}
		if string(got) != content {
			t.Errorf("FsCopyDir: %q got %q, want %q", dstPath, got, content)
		}
	}
}
