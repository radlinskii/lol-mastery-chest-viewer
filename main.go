package main

import (
	"fmt"
	"net/http"
)

func myHandler(w http.ResponseWriter, r *http.Request) {
	n, err := w.Write([]byte("Hello World!"))
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Printf("wrote %d bytes", n)
}

func main() {
	http.HandleFunc("/", myHandler)

	http.ListenAndServe(":8080", nil)
}
