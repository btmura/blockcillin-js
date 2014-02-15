package template

import (
	"html/template"
)

// MustParseFiles creates a template out of the filenames or panics.
func MustParseFiles(filenames ...string) *template.Template {
	return template.Must(template.ParseFiles(filenames...))
}
