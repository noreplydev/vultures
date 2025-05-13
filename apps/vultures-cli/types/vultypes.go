package types

type VulturesResponse struct {
	Data struct {
		Entries   []string `json:"entries"`
		Entry     Cve      `json:"entry"`
		Extradata struct {
			Pocs []string `json:"pocs"`
		} `json:"extradata"`
	} `json:"data"`
	Message string `json:"message"`
	IsError bool   `json:"isError"`
}

type Cve struct {
	Id           string `json:"id"`
	Descriptions []struct {
		Lang  string `json:"lang"`
		Value string `json:"value"`
	} `json:"descriptions"`
}
