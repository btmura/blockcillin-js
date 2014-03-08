package handlers

import (
	"net/http"

	"blockcillin/template"
)

var indexTemplate = template.MustParseFiles("templates/index.html", "templates/common.html")

type IndexTemplateArgs struct {
	Compiled bool
	Debug    bool
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	args := &IndexTemplateArgs{Compiled: true, Debug: false}
	indexTemplate.Execute(w, args)
}

func debugHandler(w http.ResponseWriter, r *http.Request) {
	args := &IndexTemplateArgs{Compiled: false, Debug: true}
	indexTemplate.Execute(w, args)
}
