package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/shurcooL/githubv4"
	"golang.org/x/oauth2"
)

func ApiGitHubUser(w http.ResponseWriter, r *http.Request) {
	githubToken := os.Getenv("GITHUB_TOKEN")

	if githubToken == "" {
		w.WriteHeader(500)
		w.Write([]byte("SERVER ERROR"))
		return
	}

	src := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: githubToken},
	)

	httpClient := oauth2.NewClient(r.Context(), src)

	var query struct {
		Viewer struct {
			Login     githubv4.String
			CreatedAt githubv4.DateTime
		}
	}

	client := githubv4.NewClient(httpClient)

	err := client.Query(r.Context(), &query, nil)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("SERVER ERROR"))
		return
	}

	fmt.Println("    Login:", query.Viewer.Login)
	fmt.Println("CreatedAt:", query.Viewer.CreatedAt)

	w.WriteHeader(200)
	w.Write([]byte("OK"))
}
