package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	utils "github.com/adityameharia/file-store/server/utils"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func deleteFile(w http.ResponseWriter, r *http.Request) {
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	vars := mux.Vars(r)

	//var resp Response

	token := r.Header.Get("bearer-token")

	email, err := utils.VerifyIdToken(token, fire)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		data := e{
			Data: "Invalid Token",
		}
		json.NewEncoder(w).Encode(data)
		return
	}

	//filename := vars["id"] + "-" + vars["filename"]

	collection = client.Database("files").Collection("files")

	filter := bson.D{primitive.E{Key: "email", Value: email}}
	//update := { $pull: { 'files': filename } }

	_, err = collection.UpdateOne(ctx, filter, bson.M{"$pull": bson.M{"files": vars["filename"]}})
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		data := e{
			Data: "Internal server Error",
		}
		json.NewEncoder(w).Encode(data)
		return
	}

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(os.Getenv("AWS_REGION"))},
	)

	// Create S3 service client
	svc := s3.New(sess)

	_, err = svc.DeleteObject(&s3.DeleteObjectInput{
		Bucket: aws.String("driveclone"),
		Key:    aws.String(vars["id"] + "-" + vars["filename"]),
	})
	if err != nil {

		w.WriteHeader(http.StatusInternalServerError)
		data := e{
			Data: "Internal server Error",
		}
		update := bson.M{"$push": bson.M{"files": vars["id"] + "-" + vars["filename"]}}
		_, err = collection.UpdateOne(ctx, filter, update)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			data := e{
				Data: "Internal server Error",
			}
			json.NewEncoder(w).Encode(data)
			return
		}
		json.NewEncoder(w).Encode(data)
		return
	}

	err = red.Del(vars["id"] + "-" + vars["filename"]).Err()
	if err != nil {
		fmt.Println(err)
	}
	err = red.Del(email).Err()
	if err != nil {
		fmt.Println(err)
	}

	fmt.Fprintf(w, "Successfully Deleted")
}
