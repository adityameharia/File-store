package main

import (
	"encoding/json"
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
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	vars := mux.Vars(r)

	//var resp Response

	token := r.Header.Get("bearer-token")

	_, err := utils.VerifyIdToken(token, fire)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		data := e{
			Data: "Invalid Token",
		}
		json.NewEncoder(w).Encode(data)
		return
	}

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(os.Getenv("AWS_REGION"))},
	)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		data := e{
			Data: "Internal Server Error",
		}
		json.NewEncoder(w).Encode(data)
		return
	}

	// Create S3 service client
	svc := s3.New(sess)

	req, _ := svc.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String("driveclone"),
		Key:    aws.String(vars["id"] + "-" + vars["filename"]),
	})
	urlStr, err := req.Presign(15 * time.Second)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		data := e{
			Data: "Internal Server Error",
		}
		json.NewEncoder(w).Encode(data)
		return
	}

	resp := PresignedUrl{
		Url: urlStr,
	}

	json.NewEncoder(w).Encode(resp)

	return
}
