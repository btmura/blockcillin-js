package handlers

import (
	"appengine"
	"net/http"

	"blockcillin/template"
)

func indexHandler(w http.ResponseWriter, r *http.Request) {
	dev := appengine.IsDevAppServer()
	args := &template.Args{
		Compiled: true,
		ShowDebugLink: dev,
		ShowReleaseLink: dev,
		ShowTestLink: dev,
	}
	template.ExecuteIndex(w, args)
}

func debugHandler(w http.ResponseWriter, r *http.Request) {
	args := &template.Args{
		ShowDebugLink: true,
		ShowReleaseLink: true,
		ShowTestLink: true,
	}
	template.ExecuteIndex(w, args)
}
