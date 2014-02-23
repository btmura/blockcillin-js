package handlers

import (
	"net/http"

	"blockcillin/template"
)

var indexTemplate = template.MustParseFiles("templates/index.html")

type IndexTemplateArgs struct {
	Compiled bool
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	args := &IndexTemplateArgs{Compiled: true}
	indexTemplate.Execute(w, args)
}

func debugHandler(w http.ResponseWriter, r *http.Request) {
	args := &IndexTemplateArgs{Compiled: false}
	indexTemplate.Execute(w, args)
}
