package main

import (
	"fmt"
	"net/http"

	"expenny.co.za/internal/templates"
	"github.com/a-h/templ"
)

func main() {
	component := templates.Hello("Bernard")

	http.Handle("/", templ.Handler(component))
	fmt.Println("on port 8080")
	http.ListenAndServe(":8080", nil)

}
