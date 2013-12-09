package handlers

import (
	"net/http"
)

func init() {
	http.HandleFunc("/", indexHandler)
}
