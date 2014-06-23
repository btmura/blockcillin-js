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
	http.HandleFunc("/", indexHandler)
	http.HandleFunc("/debug", debugHandler)
	http.HandleFunc("/tests", testHandler)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	template.ExecuteIndex(w, &template.Args{
		Compiled: true,
	})
}

func debugHandler(w http.ResponseWriter, r *http.Request) {
	template.ExecuteIndex(w, &template.Args{
		Compiled: false,
	})
}

func testHandler(w http.ResponseWriter, r *http.Request) {
	template.ExecuteTest(w, &template.Args{
		Compiled: false,
	})
}
