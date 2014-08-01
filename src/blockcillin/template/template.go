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

var indexTemplate = newTemplate("index.html")
var testsTemplate = newTemplate("tests.html")

// newTemplate creates a template with a name that must match one of the globbed templates.
func newTemplate(name string) *template.Template {
	return template.Must(template.New(name).ParseGlob("templates/*.html"))
}

// IndexArgs are arguments passed to the index template.
type Args struct {
	Debug bool
}

// ExecuteIndex executes the index template which runs the game.
func ExecuteIndex(w http.ResponseWriter, args *Args) {
	indexTemplate.Execute(w, args)
}

// ExecuteTests executes the tests template which runs the unit tests.
func ExecuteTests(w http.ResponseWriter, args *Args) {
	testsTemplate.Execute(w, args)
}
