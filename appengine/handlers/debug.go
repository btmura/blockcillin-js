package handlers

import (
	"net/http"

	"blockcillin/template"
)

var debugTemplate = template.MustParseFiles("templates/debug.html")

func debugHandler(w http.ResponseWriter, r *http.Request) {
	debugTemplate.Execute(w, nil)
}
