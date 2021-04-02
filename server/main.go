package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	utils "github.com/adityameharia/file-store/server/utils"
	"github.com/go-redis/redis"

	firebase "firebase.google.com/go/v4"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

var httpClient = &http.Client{}

var client *mongo.Client

var ctx context.Context

var collection *mongo.Collection

var red *redis.Client

var err error

var fire *firebase.App

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

type PresignedUrl struct {
	Url string `json:"url"`
}

type e struct {
	Data string `json:"data"`
}

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
	fire, err = firebase.NewApp(context.Background(), nil)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}
}

func main() {

	red = redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_ADDR"),
		Password: os.Getenv("REDIS_PASSWORD"),
	})

	defer client.Disconnect(ctx)
	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		log.Fatal(err)
	}
	r := mux.NewRouter()
	r.HandleFunc("/home", HomeHandler).Methods("GET")
	r.HandleFunc("/register", Register).Methods("POST")
	r.HandleFunc("/checkuser", checkUser).Methods("POST")
	r.HandleFunc("/upload/{id}/{filename}", fileUpload).Methods("GET")
	r.HandleFunc("/download/{id}/{filename}", filedownloader).Methods("GET")
	r.HandleFunc("/{id}/{filename}", deleteFile).Methods("DELETE")
	r.HandleFunc("/favicon.ico", handleFavicon).Methods("OPTIONS")
	r.HandleFunc("/home/favicon.ico", handleFavicon).Methods("OPTIONS")

	fmt.Println("server started")
	http.ListenAndServe(":"+os.Getenv("PORT"), utils.HeaderMiddleware(r))
}
