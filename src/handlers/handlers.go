package handlers

import (
	"net/http"

	"blockcillin/template"
)

func init() {
	http.HandleFunc("/", indexHandler)
	http.HandleFunc("/debug", debugHandler)
	http.HandleFunc("/tests", testHandler)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	template.ExecuteIndex(w, &template.Args{
		Compiled: true,
	})
}

func debugHandler(w http.ResponseWriter, r *http.Request) {
	template.ExecuteIndex(w, &template.Args{
		Compiled: false,
	})
}

func testHandler(w http.ResponseWriter, r *http.Request) {
	template.ExecuteTest(w, &template.Args{
		Compiled: false,
	})
}
