package main

import (
	"flag"
	"fmt"
	"os"
	"vultures/commands"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("")
		fmt.Println("vultures - v0")
		fmt.Println("")
		fmt.Println("usage:")
		fmt.Println("  scan: Get a scan of the binaries on the system")
		fmt.Println("")
		return
	}

	scanCmd := flag.NewFlagSet("scan", flag.ExitOnError)
	var path, outpath string
	scanCmd.StringVar(&path, "path", "/usr/local/bin", "Path of the binaries to analyze")
	scanCmd.StringVar(&outpath, "out", "", "Output JSON path for the binaries scan report")

	switch os.Args[1] {
	case "scan":
		scanCmd.Parse(os.Args[2:])
		commands.Scan(path, outpath)

	default:
		fmt.Printf("Unknown command: %s\n", os.Args[1])
		fmt.Println("usage:")
		fmt.Println("  scan: Get a scan of the binaries on the system")
		os.Exit(1)
	}
}
