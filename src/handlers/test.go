package handlers

import (
	"net/http"

	"blockcillin/template"
)

func testHandler(w http.ResponseWriter, r *http.Request) {
	args := &template.Args{ShowDebugLink: true}
	template.ExecuteTest(w, args)
}
