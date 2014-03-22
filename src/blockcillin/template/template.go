package template

import (
	"fmt"
	"html/template"
	"net/http"
	"path/filepath"
)

// ResourceSet indicates what resource set to use like release or debug.
type ResourceSet int

const (
	// Release is the resource set optimized for end-users.
	Release ResourceSet = iota

	// Debug is the resource set for developers without optimizations.
	Debug ResourceSet = iota

	// Tests is the resource set for the unit tests page.
	Tests ResourceSet = iota
)

// scriptResourceGlobs is an array of globs corresponding to the ResourceSet enums.
// The globs are used to get the list of JavaScript files that need to be included on the page.
var scriptResourceGlobs = [...][]string{
	{"res/js/bc-compiled/*.js"},
	{"res/js/bc/*.js"},
	{"res/js/bc/*.js", "res/js/bc-tests/*.js"},
}

// baseResourceDir is trimmed from resource paths to create relative urls in source code.
const baseResourceDir = "res"

// Args are arguments passed to the execute functions by users of this package.
type Args struct {
	ResourceSet     ResourceSet
	ShowDebugLink   bool
	ShowReleaseLink bool
	ShowTestLink    bool
}

// templateArgs are the actual template args including the original args.
// This has additional fields that package users should not touch.
type templateArgs struct {
	*Args
	ScriptPaths []string
}

// indexTemplate is a template that renders the game.
var indexTemplate = newTemplate("index.html")

// testTemplate is a template that renders the unit tests.
var testTemplate = newTemplate("tests.html")

// newTemplate creates a template with a name that must match one of the globbed templates.
func newTemplate(name string) *template.Template {
	return template.Must(template.New(name).ParseGlob("templates/*.html"))
}

// ExecuteIndex executes the index template which runs the game.
func ExecuteIndex(w http.ResponseWriter, args *Args) {
	templateArgs, err := makeTemplateArgs(args)
	if err != nil {
		serveError(w, newError("ExecuteIndex", err))
		return
	}
	indexTemplate.Execute(w, templateArgs)
}

// ExecuteTests executes the tests template which runs the unit tests.
func ExecuteTests(w http.ResponseWriter, args *Args) {
	templateArgs, err := makeTemplateArgs(args)
	if err != nil {
		serveError(w, newError("ExecuteTests", err))
		return
	}
	testTemplate.Execute(w, templateArgs)
}

// makeTemplateArgs adds additional fields to args to make the real template arguments.
func makeTemplateArgs(args *Args) (*templateArgs, error) {
	globs := scriptResourceGlobs[args.ResourceSet]
	scriptPaths, err := getResourcePaths(globs)
	if err != nil {
		return nil, newError("makeTemplateArgs", err)
	}
	return &templateArgs{
		Args:        args,
		ScriptPaths: scriptPaths,
	}, nil
}

// getResourcePaths resolves the given globs and makes paths suitable to put in the page.
func getResourcePaths(globs []string) ([]string, error) {
	var resourcePaths []string
	for _, g := range globs {
		filenames, err := filepath.Glob(g)
		if err != nil {
			return nil, newError("getResourcePaths", err)
		}

		relPaths := make([]string, len(filenames))
		for i, path := range filenames {
			relPaths[i], err = filepath.Rel(baseResourceDir, path)
			if err != nil {
				return nil, newError("getResourcePaths", err)
			}
		}
		resourcePaths = append(resourcePaths, relPaths...)
	}
	return resourcePaths, nil
}

// newError creates a new error from an error with an additional source label.
func newError(source string, err error) error {
	return fmt.Errorf("%s: %v", source, err)
}

// serveError just writes an error to the page.
func serveError(w http.ResponseWriter, err error) {
	fmt.Fprintf(w, "%v", err)
}
