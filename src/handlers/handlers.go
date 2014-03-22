package handlers

import (
	"appengine"
	"net/http"

	"blockcillin/template"
)

func init() {
	http.HandleFunc("/", indexHandler)
	http.HandleFunc("/debug", debugHandler)
	http.HandleFunc("/tests", testsHandler)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	dev := appengine.IsDevAppServer()
	args := &template.Args{
		ResourceSet:     template.Release,
		ShowDebugLink:   dev,
		ShowReleaseLink: dev,
		ShowTestLink:    dev,
	}
	template.ExecuteIndex(w, args)
}

func debugHandler(w http.ResponseWriter, r *http.Request) {
	args := &template.Args{
		ResourceSet:     template.Debug,
		ShowDebugLink:   true,
		ShowReleaseLink: true,
		ShowTestLink:    true,
	}
	template.ExecuteIndex(w, args)
}

func testsHandler(w http.ResponseWriter, r *http.Request) {
	args := &template.Args{
		ResourceSet:     template.Tests,
		ShowDebugLink:   true,
		ShowReleaseLink: true,
		ShowTestLink:    true,
	}
	template.ExecuteTests(w, args)
}
