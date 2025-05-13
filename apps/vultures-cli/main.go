package main

import (
	"flag"
	"fmt"
	"os"

	"github.com/noreplydev/vultures/apps/vultures-cli/commands"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("")
		fmt.Println("vultures - v0")
		fmt.Println("")
		fmt.Println("usage:")
		fmt.Println("  scan: Get a scan of the binaries on the system")
		fmt.Println("  info: Get info of the provided CVE")
		fmt.Println("")
		return
	}

	scanCmd := flag.NewFlagSet("scan", flag.ExitOnError)
	var path, outpath string
	scanCmd.StringVar(&path, "path", "/usr/local/bin", "Path of the binaries to analyze")
	scanCmd.StringVar(&outpath, "out", "", "Output JSON path for the binaries scan report")

	infoCmd := flag.NewFlagSet("info", flag.ExitOnError)

	switch os.Args[1] {
	case "scan":
		scanCmd.Parse(os.Args[2:])
		commands.Scan(path, outpath)
	case "info":
		infoCmd.Parse(os.Args[2:])
		if infoCmd.NArg() < 1 {
			fmt.Println("usage: vultures info <searchTerm>")
			os.Exit(1)
		}
		search := infoCmd.Arg(0)
		commands.Info(search)

	default:
		fmt.Printf("Unknown command: %s\n", os.Args[1])
		fmt.Println("usage:")
		fmt.Println("  scan: Get a scan of the binaries on the system")
		os.Exit(1)
	}
}
