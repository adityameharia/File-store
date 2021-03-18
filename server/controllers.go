package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	utils "github.com/adityameharia/file-store/server/utils"
)

type Response struct {
	Test string `json:"test"`
}

type Request struct {
	Token string `json:"token"`
}

func init() {
	fmt.Println("This will get called on main initialization")
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {

	if r.Method == "POST" {
		reqBody, _ := ioutil.ReadAll(r.Body)
		var tok Request
		json.Unmarshal(reqBody, &tok)
		token := tok.Token
		fmt.Println("no fking way")

		t, err := utils.VerifyIdToken(token)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(t.Email)

		w.Header().Set("Content-Type", "application/json")
		response := Response{
			Test: "Hello world",
		}
		json.NewEncoder(w).Encode(response)
		return
	}
	http.ServeFile(w, r, "static/favicon.ico")
}

func Register(w http.ResponseWriter, r *http.Request) {}
