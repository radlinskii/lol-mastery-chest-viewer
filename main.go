package main

import (
	"fmt"
	"net/http"
	"os"
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
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/", myHandler)

	http.ListenAndServe(":"+port, nil)
}
