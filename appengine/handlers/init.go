package handlers

import (
	"net/http"
)

func init() {
	http.HandleFunc("/", indexHandler)
	http.HandleFunc("/debug", debugHandler)
}
