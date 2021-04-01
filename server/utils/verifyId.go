package utils

import (
	"context"

	firebase "firebase.google.com/go/v4"
)

func VerifyIdToken(token string, fire *firebase.App) (string, error) {
	c, err := fire.Auth(context.Background())
	if err != nil {
		return "", err
	}

	t, err := c.VerifyIDToken(context.Background(), token)
	if err != nil {
		return "", err
	}

	email := t.Claims["email"].(string)

	return email, nil
}
