package handlers

import (
	"html/template"
	"net/http"
)

func debugHandler(w http.ResponseWriter, r *http.Request) {
	t := template.Must(template.ParseFiles("templates/debug.html"))
	t.Execute(w, nil)
}
