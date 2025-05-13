package commands

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"regexp"

	"github.com/noreplydev/vultures/apps/vultures-cli/utils"
)

type CveMatch struct {
	Id        string `json:"id"`
	MatchType string `json:"matchType"`
}

type Bin struct {
	BinName         string     `json:"binName"`
	VersionString   string     `json:"versionString"`
	InferredVersion string     `json:"inferredVersion"`
	Versions        []string   `json:"versions"`
	Cves            []CveMatch `json:"cves"`
}

type VulturesBinariesReport struct {
	TotalBinaries     int   `json:"totalBinaries"`
	VersionedBinaries int   `json:"versionedBinaries"`
	BinariesData      []Bin `json:"binariesData"`
}

func Scan(path string, outpath string) {
	binariesReportData := scan(path)

	// get each binary cves
	for i, bin := range binariesReportData.BinariesData {
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
			cves := []CveMatch{}
			for _, cve := range response.Data.Entries {
				fmt.Printf("  - %s \n", cve)
				cves = append(cves, CveMatch{Id: cve})
			}
			binariesReportData.BinariesData[i].Cves = cves
		} else {
			fmt.Printf("✓ %s \n", bin.BinName)
		}
	}

	if len(outpath) > 0 {
		dataJson, _ := json.MarshalIndent(binariesReportData, "", "  ")
		os.WriteFile(outpath, []byte(dataJson), 0770)
	}

	println("")
	println("total binaries: ", binariesReportData.TotalBinaries)
	println("versioned binaries: ", binariesReportData.VersionedBinaries)
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
