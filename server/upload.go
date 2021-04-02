package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	utils "github.com/adityameharia/file-store/server/utils"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// // UploadFileToS3 saves a file to aws bucket and returns the url to // the file and an error if there's any
// func UploadFileToS3(filename string, s *session.Session, file multipart.File, fileHeader *multipart.FileHeader) (string, bool) {

// 	size := fileHeader.Size
// 	buffer := make([]byte, size)
// 	file.Read(buffer)

// 	_, err := s3.New(s).PutObject(&s3.PutObjectInput{
// 		Bucket:        aws.String("driveclone"),
// 		Key:           aws.String(filename),
// 		Body:          bytes.NewReader(buffer),
// 		ContentLength: aws.Int64(int64(size)),
// 		ContentType:   aws.String(http.DetectContentType(buffer)),
// 	})
// 	if err != nil {
// 		fmt.Println(err)
// 		return filename, false
// 	}

// 	return filename, true
// }

// func fileUpload(w http.ResponseWriter, r *http.Request) {
// 	// maxSize := int64(1024000) // allow only 1MB of file size

// 	// err := r.ParseMultipartForm(maxSize)
// 	// if err != nil {
// 	// 	log.Println(err)
// 	// 	fmt.Fprintf(w, "Image too large. Max Size: %v", maxSize)
// 	// 	return
// 	// }

// 	var resp Response

// 	token := r.Header.Get("bearer-token")

// 	email, err := utils.VerifyIdToken(token, fire)
// 	if err != nil {
// 		w.WriteHeader(http.StatusUnauthorized)
// 		data := e{
// 			Data: "Invalid Token",
// 		}
// 		json.NewEncoder(w).Encode(data)
// 		return
// 	}

// 	collection = client.Database("files").Collection("files")

// 	filter := bson.D{primitive.E{Key: "email", Value: email}}

// 	err = collection.FindOne(ctx, filter).Decode(&resp)
// 	if err != nil {
// 		w.WriteHeader(http.StatusBadRequest)
// 		data := e{
// 			Data: "User Not Found",
// 		}
// 		json.NewEncoder(w).Encode(data)
// 		return
// 	}

// 	file, fileHeader, err := r.FormFile("file")
// 	if err != nil {
// 		log.Println(err)
// 		w.WriteHeader(http.StatusBadRequest)
// 		data := e{
// 			Data: "Unable to get File",
// 		}
// 		json.NewEncoder(w).Encode(data)
// 		return
// 	}
// 	defer file.Close()

// 	// create an AWS session which can be
// 	// reused if we're uploading many files
// 	s, err := session.NewSession(&aws.Config{
// 		Region: aws.String(os.Getenv("AWS_REGION")),
// 		Credentials: credentials.NewStaticCredentials(
// 			os.Getenv("AWS_ACCESS_KEY_ID"),     // id
// 			os.Getenv("AWS_SECRET_ACCESS_KEY"), // secret
// 			""),                                // token can be left blank for now
// 	})
// 	if err != nil {
// 		w.WriteHeader(http.StatusBadRequest)
// 		data := e{
// 			Data: "Could Not upload file",
// 		}
// 		json.NewEncoder(w).Encode(data)
// 		return
// 	}

// 	fileName, check := UploadFileToS3(resp.ID.Hex()+"-"+fileHeader.Filename, s, file, fileHeader)
// 	if !check {
// 		w.WriteHeader(http.StatusInternalServerError)
// 		data := e{
// 			Data: "Internal server Error",
// 		}
// 		json.NewEncoder(w).Encode(data)
// 		return
// 	}

// 	update := bson.M{"$push": bson.M{"files": fileHeader.Filename}}

// 	_, er := collection.UpdateOne(ctx, filter, update)
// 	if er != nil {
// 		_, err := s3.New(s).DeleteObject(&s3.DeleteObjectInput{
// 			Bucket: aws.String("driveclone"),
// 			Key:    aws.String(fileHeader.Filename),
// 		})
// 		if err != nil {
// 			w.WriteHeader(http.StatusInternalServerError)
// 			data := e{
// 				Data: "Internal server Error",
// 			}
// 			json.NewEncoder(w).Encode(data)
// 			return
// 		}
// 	}
// 	err = collection.FindOne(ctx, filter).Decode(&resp)
// 	if err != nil {
// 		w.WriteHeader(http.StatusBadRequest)
// 		data := e{
// 			Data: "User Not Found",
// 		}
// 		json.NewEncoder(w).Encode(data)
// 		return
// 	}
// 	u, err := json.Marshal(resp)
// 	if err != nil {
// 		w.WriteHeader(http.StatusInternalServerError)
// 		data := e{
// 			Data: "Internal server Error",
// 		}
// 		json.NewEncoder(w).Encode(data)
// 		return
// 	}

// 	err = red.Set(email, u, 59*time.Minute).Err()
// 	if err != nil {
// 		fmt.Println(err)
// 	}

// 	fmt.Fprintf(w, "Image uploaded successfully: %v", fileName)
// }

func fileUpload(w http.ResponseWriter, r *http.Request) {
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	vars := mux.Vars(r)

	var response Response

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

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(os.Getenv("AWS_REGION"))},
	)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		data := e{
			Data: "Internal Server Error",
		}
		json.NewEncoder(w).Encode(data)
		return
	}

	// Create S3 service client
	svc := s3.New(sess)

	filename := vars["id"] + "-" + vars["filename"]

	req, _ := svc.PutObjectRequest(&s3.PutObjectInput{
		Bucket: aws.String("driveclone"),
		Key:    aws.String(filename),
	})
	str, err := req.Presign(15 * time.Second)
	if err != nil {
		fmt.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		data := e{
			Data: "Internal Server Error",
		}
		json.NewEncoder(w).Encode(data)
		return
	}
	fmt.Println(str)

	res := PresignedUrl{
		Url: str,
	}

	collection = client.Database("files").Collection("files")

	filter := bson.D{primitive.E{Key: "email", Value: email}}

	update := bson.M{"$push": bson.M{"files": vars["filename"]}}

	_, er := collection.UpdateOne(ctx, filter, update)
	if er != nil {
		fmt.Println(er)
		_, err := svc.DeleteObject(&s3.DeleteObjectInput{
			Bucket: aws.String("driveclone"),
			Key:    aws.String(filename),
		})
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			data := e{
				Data: "Internal server Error",
			}
			json.NewEncoder(w).Encode(data)
			return
		}
	}

	err = collection.FindOne(ctx, filter).Decode(&response)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		data := e{
			Data: "User Not Found",
		}
		json.NewEncoder(w).Encode(data)
		return
	}
	u, err := json.Marshal(response)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		data := e{
			Data: "Internal server Error",
		}
		json.NewEncoder(w).Encode(data)
		return
	}

	err = red.Set(email, u, 0).Err()
	if err != nil {
		fmt.Println(err)
	}

	json.NewEncoder(w).Encode(res)

	return
}
