package utils

import "net/http"

func HeaderMiddleware(h http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "*")
		h.ServeHTTP(w, r)
	}

	return http.HandlerFunc(fn)
}
