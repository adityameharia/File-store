package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	utils "github.com/adityameharia/file-store/server/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Request struct {
	Email string   `json:"email"`
	Name  string   `json:"name"`
	Files []string `json:"files"`
}

type Response struct {
	ID    primitive.ObjectID `bson:"_id, omitempty"`
	Email string             `json:"email"`
	Name  string             `json:"name"`
	Files []string           `json:"files"`
}

type error struct {
	Data string `json:"data"`
}

func Register(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var user Request
	var resp Request

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		data := error{
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
			data := error{
				Data: "Internal server Error",
			}
			json.NewEncoder(w).Encode(data)
			return
		}
		w.WriteHeader(http.StatusCreated)
		return
	}
	w.WriteHeader(http.StatusBadRequest)
	data := error{
		Data: "The given emailId already exists",
	}
	json.NewEncoder(w).Encode(data)
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {

	var resp Request

	token := r.Header.Get("bearer-token")
	fmt.Println(token)

	t, err := utils.VerifyIdToken(token)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		data := error{
			Data: "Invalid Token Provided",
		}
		json.NewEncoder(w).Encode(data)
		return
	}

	collection = client.Database("files").Collection("files")
	filter := bson.D{{"email", t.Email}}

	fmt.Println(t.Email)

	err = collection.FindOne(ctx, filter).Decode(&resp)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		data := error{
			Data: "No account with the given emailId exists",
		}
		json.NewEncoder(w).Encode(data)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(resp)
	return

}

func checkUser(w http.ResponseWriter, r *http.Request) {
	var user Request
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		data := error{
			Data: "Internal server Error",
		}
		json.NewEncoder(w).Encode(data)
		return
	}
	collection = client.Database("files").Collection("files")

	filter := bson.D{{"email", user.Email}}

	fmt.Println(user.Email)

	err = collection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		data := error{
			Data: "No account with the given emailId exists",
		}
		json.NewEncoder(w).Encode(data)

		return
	}
	w.WriteHeader(http.StatusOK)
	return
}
