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
	args := &template.Args{
		Compiled: true,
	}
	template.ExecuteIndex(w, args)
}

func debugHandler(w http.ResponseWriter, r *http.Request) {
	args := &template.Args{
		Compiled: false,
	}
	template.ExecuteIndex(w, args)
}

func testHandler(w http.ResponseWriter, r *http.Request) {
	args := &template.Args{
		Compiled: false,
	}
	template.ExecuteTest(w, args)
}
