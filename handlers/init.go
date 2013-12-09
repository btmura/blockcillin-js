package handlers

import (
	"fmt"
	"net/http"
)

func init() {
	http.HandleFunc("/", indexHandler)
}

func indexHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprint(w, "Hello world!")
}
