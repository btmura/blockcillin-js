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

package handlers

import (
	"net/http"

	"blockcillin/template"
)

func init() {
	handle("/", template.Index, template.Release)
	handle("/tests", template.Tests, template.Release)

	handle("/debug", template.Index, template.Debug)
	handle("/debug/tests", template.Tests, template.Debug)

	http.HandleFunc("/docs", docsHandler)
}

func handle(pattern string, name template.Name, mode template.Mode) {
	http.HandleFunc(pattern, func(w http.ResponseWriter, r *http.Request) {
		template.Execute(w, name, &template.Args{Mode: mode})
	})
}

func docsHandler(w http.ResponseWriter, r *http.Request) {
	// Redirect since Docker doesn't produce an index.html.
	http.Redirect(w, r, "docs/main.js.html", 302)
}
