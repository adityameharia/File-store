package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	utils "github.com/adityameharia/file-store/server/utils"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var httpClient = &http.Client{}

var client *mongo.Client

var ctx context.Context

var collection *mongo.Collection

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	c, err := mongo.NewClient(options.Client().ApplyURI(os.Getenv("MONGOURI")))
	if err != nil {
		log.Fatal(err)
	}
	client = c
	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Second)
	cancel()
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
	r.HandleFunc("/home", HomeHandler).Methods("GET")
	r.HandleFunc("/register", Register).Methods("POST")
	r.HandleFunc("/checkuser", checkUser).Methods("POST")
	r.HandleFunc("/upload", fileUpload).Methods("POST")

	fmt.Println("server started")
	http.ListenAndServe(":8080", utils.HeaderMiddleware(r))
}
