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
)

func deleteFile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	//var resp Response

	t, err := utils.VerifyIdToken(r.Header.Get("bearer-token"))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		data := e{
			Data: "Invalid Token Provided",
		}
		json.NewEncoder(w).Encode(data)
		return
	}

	//filename := vars["id"] + "-" + vars["filename"]

	collection = client.Database("files").Collection("files")

	filter := bson.D{{"email", t.Email}}
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
		// update := bson.M{"$push": bson.M{"files": vars["id"] + "-" + vars["filename"]}}
		// _, err = collection.UpdateOne(ctx, filter, update)

		// if err != nil {
		// 	w.WriteHeader(http.StatusInternalServerError)
		// 	data := e{
		// 		Data: "Internal server Error",
		// 	}
		// 	json.NewEncoder(w).Encode(data)
		// 	return
		// }
		json.NewEncoder(w).Encode(data)
		return
	}

	err = red.Del(vars["id"] + "-" + vars["filename"]).Err()
	if err != nil {
		fmt.Println(err)
	}
	err = red.Del(t.Email).Err()
	if err != nil {
		fmt.Println(err)
	}

	fmt.Fprintf(w, "Successfully Deleted")
}
