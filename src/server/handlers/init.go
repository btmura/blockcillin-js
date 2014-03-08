package handlers

import (
	"net/http"

	"server/template"
)

func init() {
	http.HandleFunc("/", indexHandler)
	http.HandleFunc("/debug", debugHandler)
	http.HandleFunc("/tests", testsHandler)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	args := &template.IndexArgs{Compiled: true, Debug: false}
	template.ExecuteIndex(w, args)
}

func debugHandler(w http.ResponseWriter, r *http.Request) {
	args := &template.IndexArgs{Compiled: false, Debug: true}
	template.ExecuteIndex(w, args)
}

func testsHandler(w http.ResponseWriter, r *http.Request) {
	template.ExecuteTests(w);
}
