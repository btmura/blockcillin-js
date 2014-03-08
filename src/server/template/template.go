package template

import (
	"html/template"
	"net/http"
)

var indexTemplate = MustParseFiles(
	"client/templates/index.html",
	"client/templates/common.html")

var testsTemplate = MustParseFiles(
	"client/templates/tests.html",
	"client/templates/common.html")

// MustParseFiles creates a template out of the filenames or panics.
func MustParseFiles(filenames ...string) *template.Template {
	return template.Must(template.ParseFiles(filenames...))
}

type IndexArgs struct {
	Compiled bool
	Debug    bool
}

func ExecuteIndex(w http.ResponseWriter, args *IndexArgs) {
	indexTemplate.Execute(w, args)
}

func ExecuteTests(w http.ResponseWriter) {
	testsTemplate.Execute(w, nil)
}
