package template

import (
	"html/template"
	"net/http"
)

var indexTemplate = mustParseFiles(
	"client/templates/index.html",
	"client/templates/common.html")

var testsTemplate = mustParseFiles(
	"client/templates/tests.html",
	"client/templates/common.html")

// MustParseFiles creates a template out of the filenames or panics.
func mustParseFiles(filenames ...string) *template.Template {
	return template.Must(template.ParseFiles(filenames...))
}

// IndexArgs are arguments passed to the index template.
type IndexArgs struct {
	Compiled bool
	Debug    bool
}

// ExecuteIndex executes the index template which runs the game.
func ExecuteIndex(w http.ResponseWriter, args *IndexArgs) {
	indexTemplate.Execute(w, args)
}

// ExecuteTests executes the tests template which runs the unit tests.
func ExecuteTests(w http.ResponseWriter) {
	testsTemplate.Execute(w, nil)
}
