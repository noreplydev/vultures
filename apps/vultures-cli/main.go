package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"net/http"
	"os"
	"regexp"
	"vultures-cli/utils"
)

type Bin struct {
	BinName         string
	VersionString   string
	InferredVersion string
	Versions        []string
}

type VulturesBinariesReport struct {
	TotalBinaries     int
	VersionedBinaries int
	BinariesData      []Bin
}

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

	// scan command
	scanCmd := flag.NewFlagSet("scan", flag.ExitOnError)
	var path string
	var outpath string
	scanCmd.StringVar(&path, "path", "/usr/local/bin", "Path of the binaries to analize")
	scanCmd.StringVar(&outpath, "out", "", "Path for the output json with the binaries scan report")

	switch os.Args[1] {
	case "scan":
		scanCmd.Parse(os.Args[2:]) // parse if commands params were required
		binariesReportData := scan(path)
		if len(outpath) > 0 {
			dataJson, _ := json.MarshalIndent(binariesReportData, "", "  ")
			os.WriteFile(outpath, []byte(dataJson), 0770)
		}

		// get each binary cves
		for _, bin := range binariesReportData.BinariesData {
			requestURL := fmt.Sprintf("https://vultures.dev/api/v0/cve/search?query=%s", bin.BinName)
			res, err := http.Get(requestURL)
			if err != nil {
				fmt.Printf(" %s\n", err)
				os.Exit(1)
			}

			resBody, err := io.ReadAll(res.Body)
			if err != nil {
				fmt.Printf("│ 🞫 %s\n", err)
				os.Exit(1)
			}

			type VulturesResponse struct {
				Data struct {
					Entries []string `json:"entries"`
				} `json:"data"`
				Message string `json:"message"`
				IsError bool   `json:"isError"`
			}

			var response VulturesResponse
			json.Unmarshal(resBody, &response)
			if len(response.Data.Entries) > 0 {
				fmt.Printf("⚠ %s \n", bin.BinName)
				for _, cve := range response.Data.Entries {
					fmt.Printf("  - %s \n", cve)
				}
			} else {
				fmt.Printf("✓ %s \n", bin.BinName)
			}
		}

		println("")
		println("total binaries: ", binariesReportData.TotalBinaries)
		println("versioned binaries: ", binariesReportData.VersionedBinaries)

	default:
		fmt.Printf("Unknown command: %s\n", os.Args[1])
		fmt.Println("usage:")
		fmt.Println("  scan: Get a scan of the binaries on the system")
		os.Exit(1)
	}
}

func scan(path string) VulturesBinariesReport {
	fmt.Println("\nvultures v0\n┌───")
	totalBinaries := []string{}

	binaries, err := os.ReadDir(path)
	if err != nil {
		println("│ cannot scan path: ", path)
		println("...")
		os.Exit(1)
	} else {
		fmt.Printf("│ scanning for binaries on: %s\n", path)
	}

	for _, entry := range binaries {
		if entry.IsDir() {
			continue
		}
		totalBinaries = append(totalBinaries, entry.Name())
	}

	binariesData := []Bin{}

	r, _ := regexp.Compile(`\b(?:[A-Za-z]+-)?v?\d+(?:\.\d+)*(?:-[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)*)*\b`)
	for _, bin := range totalBinaries {
		fmt.Printf("\r\x1b[2K│ Getting version of %s", bin)
		result := getBinVersion(bin)
		if len(result) > 0 {
			versions := r.FindAllString(result, -1)
			if len(versions) > 0 {
				binariesData = append(binariesData, Bin{BinName: bin, VersionString: result, InferredVersion: versions[0], Versions: versions})
			}
		} else {
			binariesData = append(binariesData, Bin{BinName: bin, VersionString: "unknown"})
		}
	}
	fmt.Printf("\r\x1b[2K│ done!\n")
	fmt.Printf("\r\x1b[2K└───\n")

	versionedBinaries := utils.Filter(binariesData, func(b Bin) bool {
		return b.VersionString != "unknown"
	})

	return VulturesBinariesReport{
		TotalBinaries:     len(totalBinaries),
		VersionedBinaries: len(versionedBinaries),
		BinariesData:      binariesData,
	}
}

var tryFlags = []string{"--version", "-version", "-V", "-v", "version", "-dumpversion"}

func getBinVersion(bin string) string {
	for _, command := range tryFlags {
		stdout, stderr, err := utils.RunWithTimeout(bin, command)
		if err != nil {
			//fmt.Printf("Error: %v\n", err)
			continue
		}
		if len(stdout) > 0 {
			//println(stdout)
			return stdout
		}
		if len(stderr) > 0 {
			//println("no stdout and no error found")
			continue
		}
	}
	return ""
}
