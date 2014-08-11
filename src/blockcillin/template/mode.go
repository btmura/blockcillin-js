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

import "fmt"

// Mode is a mode that the application can be. It's used to enable debugging mode.
type Mode struct {
	debug           bool
	cssFormatString string
}

// Debug is a mode where nothing is minified or compiled to aid debugging.
var Debug = Mode{
	debug:           true,
	cssFormatString: "/css/%s.css",
}

// Release is a mode where everything is minified and compiled for performance.
var Release = Mode{
	debug:           false,
	cssFormatString: "/css/%s.min.css",
}

// Debug returns whether the mode is for debugging.
func (m Mode) Debug() bool {
	return m.debug
}

// cssPath returns the path of the CSS resource by its basename and whether the app is in debug mode.
func (m Mode) cssPath(basename string) string {
	return fmt.Sprintf(m.cssFormatString, basename)
}
