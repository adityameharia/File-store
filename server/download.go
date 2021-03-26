package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	utils "github.com/adityameharia/file-store/server/utils"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gorilla/mux"
)

func filedownloader(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)

	//var resp Response

	_, err := utils.VerifyIdToken(r.Header.Get("bearer-token"))
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		data := e{
			Data: "Invalid Token Provided",
		}
		json.NewEncoder(w).Encode(data)
		return
	}

	val, err := red.Get(vars["id"] + "-" + vars["filename"]).Result()
	if err != nil {
		fmt.Println(err)
	}
	fmt.Println(val)
	if val != "" {
		resp := PresignedUrl{
			Url: val,
		}

		json.NewEncoder(w).Encode(resp)

		return
	}

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(os.Getenv("AWS_REGION"))},
	)

	// Create S3 service client
	svc := s3.New(sess)

	req, _ := svc.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String("driveclone"),
		Key:    aws.String(vars["id"] + "-" + vars["filename"]),
	})
	urlStr, err := req.Presign(60 * time.Minute)

	if err != nil {
		log.Println("Failed to sign request", err)
	}

	resp := PresignedUrl{
		Url: urlStr,
	}

	err = red.Set(vars["id"]+"-"+vars["filename"], urlStr, 59*time.Minute).Err()
	if err != nil {
		fmt.Println(err)
	}

	json.NewEncoder(w).Encode(resp)

	return
}
