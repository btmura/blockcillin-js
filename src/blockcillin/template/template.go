package template

import (
	"html/template"
	"net/http"
)

var indexTemplate = newTemplate("index.html")
var testTemplate = newTemplate("tests.html")

// newTemplate creates a template with a name that must match one of the globbed templates.
func newTemplate(name string) *template.Template {
	return template.Must(template.New(name).ParseGlob("templates/*.html"))
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
