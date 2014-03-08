package handlers

import (
	"net/http"

	"blockcillin/template"
)

var testsTemplate = template.MustParseFiles("templates/tests.html")

func testsHandler(w http.ResponseWriter, r *http.Request) {
	testsTemplate.Execute(w, nil)
}
