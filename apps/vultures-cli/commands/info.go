package commands

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/noreplydev/vultures/apps/vultures-cli/types"
)

func Info(search string) {
	requestURL := fmt.Sprintf("http://localhost:8000/api/v0/cve/%s", search)
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

	var response types.VulturesResponse
	json.Unmarshal(resBody, &response)

	if response.IsError {
		println("\nVulnerability info not found\n")
		return
	}

	println("\n" + response.Data.Entry.Id + "\n")
	println("\n" + response.Data.Entry.Descriptions[0].Value + "\n\n")

	for _, v := range response.Data.Extradata.Pocs {
		fmt.Printf("[POC] %s\n", v)
	}
	println()
}
