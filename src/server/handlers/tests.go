package handlers

import (
	"net/http"

	"server/template"
)

var testsTemplate = template.MustParseFiles(
	"shared/templates/tests.html",
	"shared/templates/common.html")

func testsHandler(w http.ResponseWriter, r *http.Request) {
	testsTemplate.Execute(w, nil)
}
