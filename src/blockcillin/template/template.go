//
// Copyright (C) 2014  Brian Muramatsu
//
// This file is part of blockcillin.
//
// blockcillin is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// blockcillin is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with blockcillin.  If not, see <http://www.gnu.org/licenses/>.
//

package template

import (
	"html/template"
	"net/http"
)

type Name int

const (
	Index Name = iota
	Tests
)

// Args are arguments passed to Execute function.
type Args struct {
	Mode Mode
}

// Execute executes the template by name and args.
func Execute(w http.ResponseWriter, name Name, args *Args) {
	templateMap[name].Execute(w, args)
}

// templateMap is map from name to template used by the Execute function.
var templateMap = map[Name]*template.Template{
	Index: newTemplate("index.html"),
	Tests: newTemplate("tests.html"),
}

// newTemplate creates a template with a name that must match one of the globbed templates.
func newTemplate(name string) *template.Template {
	return template.Must(template.New(name).Funcs(funcMap).ParseGlob("templates/*.html"))
}

// funcMap is a map from name to helper function available to templates.
var funcMap = map[string]interface{}{
	"cssPath": cssPath,
}

func cssPath(basename string, mode Mode) string {
	return mode.cssPath(basename)
}
