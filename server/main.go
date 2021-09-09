package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/logs", createLog)

	err := http.ListenAndServe(":3000", mux)
	log.Fatal(err)
}

type SearchResult struct {
	Title string `json:"title"`
}

type LogRequest struct {
	Results []SearchResult `json:"results"`
}

func createLog(w http.ResponseWriter, r *http.Request) {
	var lr LogRequest
	err := json.NewDecoder(r.Body).Decode(&lr)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	fmt.Printf("\nReceived a new log request with %d search results:\n", len(lr.Results))
	for _, result := range lr.Results {
		fmt.Println("- " + result.Title)
	}
}
