package template

import (
	"html/template"
	"net/http"
)

var indexTemplate = mustParseFiles(
	"client/templates/index.html",
	"client/templates/common.html")

var testTemplate = mustParseFiles(
	"client/templates/test.html",
	"client/templates/common.html")

// MustParseFiles creates a template out of the filenames or panics.
func mustParseFiles(filenames ...string) *template.Template {
	return template.Must(template.ParseFiles(filenames...))
}

// IndexArgs are arguments passed to the index template.
type Args struct {
	Compiled      bool
	ShowDebugLink bool
	ShowTestLink  bool
}

// ExecuteIndex executes the index template which runs the game.
func ExecuteIndex(w http.ResponseWriter, args *Args) {
	indexTemplate.Execute(w, args)
}

// ExecuteTests executes the tests template which runs the unit tests.
func ExecuteTest(w http.ResponseWriter, args *Args) {
	testTemplate.Execute(w, args)
}
