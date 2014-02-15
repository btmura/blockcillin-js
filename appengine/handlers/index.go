package handlers

import (
	"net/http"

	"blockcillin/template"
)

var indexTemplate = template.MustParseFiles("templates/index.html")

func indexHandler(w http.ResponseWriter, r *http.Request) {
	indexTemplate.Execute(w, nil)
}
