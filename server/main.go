package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	utils "github.com/adityameharia/file-store/server/utils"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var httpClient = &http.Client{}

var client *mongo.Client

var ctx context.Context

func init() {
	c, err := mongo.NewClient(options.Client().ApplyURI("mongodb+srv://aditya:adityapassword@file-store.hi3s7.mongodb.net/file-store?retryWrites=true&w=majority"))
	if err != nil {
		log.Fatal(err)
	}
	client = c
	ctx, _ = context.WithTimeout(context.Background(), 100*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
}

func main() {
	defer client.Disconnect(ctx)
	err := client.Ping(ctx, readpref.Primary())
	if err != nil {
		log.Fatal(err)
	}
	r := mux.NewRouter()
	r.HandleFunc("/", HomeHandler).Methods("GET", "OPTIONS")
	r.HandleFunc("/", Register).Methods("POST", "OPTIONS")

	fmt.Println("server started")
	http.ListenAndServe(":8080", utils.HeaderMiddleware(r))
}
