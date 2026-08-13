package main

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	r := chi.NewRouter()

	// Setup the logger
	r.Use(middleware.Logger)

	// Only allow certain content types
	r.Use(middleware.AllowContentType("application/json", "text/xml"))

	// Configure cross origin resource sharing (CORS)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost", "https://bcm.works", "https://murty.au", "https://bcm.id.au"},
		AllowedMethods:   []string{"GET", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	r.Get("/", ApiHealth)
	r.Get("/health", ApiHealth)

	// Example of a dynamic route
	// r.Get("/articles/{date}-{slug}", getArticle)
	// getArticle(w http.ResponseWriter, r *http.Request) {
	// dateParam := chi.URLParam(r, "date")
	// slugParam := chi.URLParam(r, "slug")

	fmt.Println("Server starting at http://localhost:3000")
	http.ListenAndServe(":3000", r)
}
