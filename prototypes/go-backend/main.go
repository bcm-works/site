package main

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

func main() {
	// Initialise the router
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

	// Endpoint: /api/health - Health check
	r.Get("/api/health", ApiHealth)

	// Endpoint: /api/github-user - GitHub user info
	r.Get("/api/github-user", ApiGitHubUser)

	// Example of a route with a dynamic section
	r.Get("/posts/{slug}", func(w http.ResponseWriter, r *http.Request) {
		slugParam := chi.URLParam(r, "slug")
		w.Write([]byte("Post slug request: " + slugParam))
	})

	// Start the web server
	fmt.Println("Server starting at http://localhost:3000")
	http.ListenAndServe(":3000", r)
}
