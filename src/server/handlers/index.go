package handlers

import (
	"net/http"

	"server/template"
)

func indexHandler(w http.ResponseWriter, r *http.Request) {
	args := &template.IndexArgs{Compiled: true, Debug: false}
	template.ExecuteIndex(w, args)
}

func debugHandler(w http.ResponseWriter, r *http.Request) {
	args := &template.IndexArgs{Compiled: false, Debug: true}
	template.ExecuteIndex(w, args)
}
