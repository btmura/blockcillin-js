package handlers

import (
	"net/http"

	"blockcillin/template"
)

func indexHandler(w http.ResponseWriter, r *http.Request) {
	args := &template.Args{Compiled: true}
	template.ExecuteIndex(w, args)
}

func debugHandler(w http.ResponseWriter, r *http.Request) {
	args := &template.Args{ShowTestLink: true}
	template.ExecuteIndex(w, args)
}
