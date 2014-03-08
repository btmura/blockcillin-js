package handlers

import (
	"net/http"

	"server/template"
)

func testsHandler(w http.ResponseWriter, r *http.Request) {
	template.ExecuteTests(w);
}
