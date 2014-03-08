package handlers

import (
	"net/http"

	"blockcillin/template"
)

var testTemplate = template.MustParseFiles("templates/test.html")

func testHandler(w http.ResponseWriter, r *http.Request) {
	testTemplate.Execute(w, nil)
}
