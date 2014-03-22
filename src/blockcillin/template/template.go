package template

import (
	"html/template"
	"net/http"
)

var indexTemplate = mustParseFiles(
	"templates/index.html",
	"templates/menu.html",
	"templates/scripts.html",
	"templates/shaders.html")

var testTemplate = mustParseFiles(
	"templates/tests.html",
	"templates/menu.html",
	"templates/scripts.html",
	"templates/shaders.html")

// mustParseFiles creates a template out of the filenames or panics.
func mustParseFiles(filenames ...string) *template.Template {
	return template.Must(template.ParseFiles(filenames...))
}

// IndexArgs are arguments passed to the index template.
type Args struct {
	Compiled        bool
	ShowDebugLink   bool
	ShowReleaseLink bool
	ShowTestLink    bool
}

// ExecuteIndex executes the index template which runs the game.
func ExecuteIndex(w http.ResponseWriter, args *Args) {
	indexTemplate.Execute(w, args)
}

// ExecuteTests executes the tests template which runs the unit tests.
func ExecuteTest(w http.ResponseWriter, args *Args) {
	testTemplate.Execute(w, args)
}
