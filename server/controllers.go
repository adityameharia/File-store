package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	utils "github.com/adityameharia/file-store/server/utils"
	"go.mongodb.org/mongo-driver/bson"
)

func Register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var user Request
	var resp Request

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		data := e{
			Data: "Internal server Error",
		}
		json.NewEncoder(w).Encode(data)

		return
	}

	user.Files = make([]string, 0)
	collection = client.Database("files").Collection("files")
	filter := bson.D{{"email", user.Email}}

	err = collection.FindOne(ctx, filter).Decode(&resp)
	if err != nil {
		_, err := collection.InsertOne(context.TODO(), user)
		if err != nil {
			log.Fatal(err)
			w.WriteHeader(http.StatusInternalServerError)
			data := e{
				Data: "Internal server Error",
			}
			json.NewEncoder(w).Encode(data)
			return
		}
		w.WriteHeader(http.StatusCreated)

		return
	}

	w.WriteHeader(http.StatusBadRequest)
	data := e{
		Data: "The given emailId already exists",
	}
	json.NewEncoder(w).Encode(data)
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {

	var resp Response

	token := r.Header.Get("bearer-token")

	t, err := utils.VerifyIdToken(token)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		data := e{
			Data: "Invalid Token Provided",
		}
		json.NewEncoder(w).Encode(data)
		return
	}

	val, err := red.Get(t.Email).Result()
	if err != nil {
		fmt.Println(err)
	}
	if val != "" {
		err := json.Unmarshal([]byte(val), &resp)
		if err == nil {
			json.NewEncoder(w).Encode(resp)
			return

		}
		fmt.Println(err)
	}

	collection = client.Database("files").Collection("files")
	filter := bson.D{{"email", t.Email}}

	err = collection.FindOne(ctx, filter).Decode(&resp)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		data := e{
			Data: "No account with the given emailId exists",
		}
		json.NewEncoder(w).Encode(data)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	u, err := json.Marshal(resp)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		data := e{
			Data: "Internal Server Error",
		}
		json.NewEncoder(w).Encode(data)
		return
	}

	err = red.Set(t.Email, u, 59*time.Minute).Err()
	if err != nil {
		fmt.Println(err)
	}

	json.NewEncoder(w).Encode(resp)

	return

}

func checkUser(w http.ResponseWriter, r *http.Request) {
	var user Request
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		data := e{
			Data: "Internal server Error",
		}
		json.NewEncoder(w).Encode(data)
		return
	}
	collection = client.Database("files").Collection("files")

	filter := bson.D{{"email", user.Email}}

	err = collection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		data := e{
			Data: "No account with the given emailId exists",
		}
		json.NewEncoder(w).Encode(data)

		return
	}
	w.WriteHeader(http.StatusOK)
	return
}
