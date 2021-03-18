package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/gorilla/mux"
	"google.golang.org/api/oauth2/v2"
)

type Response struct {
	Test string `json:"test"`
}

type Request struct {
	Token string `json:"token"`
}

var httpClient = &http.Client{}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/", HomeHandler).Methods("POST", "OPTIONS")

	fmt.Println("server started")
	http.ListenAndServe(":8080", r)
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	if r.Method == "POST" {
		reqBody, _ := ioutil.ReadAll(r.Body)
		var tok Request
		json.Unmarshal(reqBody, &tok)
		token := tok.Token
		fmt.Println("no fking way")

		var t *oauth2.Tokeninfo
		t, err := verifyIdToken(token)
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

func verifyIdToken(idToken string) (*oauth2.Tokeninfo, error) {
	oauth2Service, err := oauth2.New(&http.Client{})
	if err != nil {
		return nil, err
	}
	tokenInfoCall := oauth2Service.Tokeninfo()
	tokenInfoCall.IdToken(idToken)
	return tokenInfoCall.Do()
}
