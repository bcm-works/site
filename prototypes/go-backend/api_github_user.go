package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/shurcooL/githubv4"
	"golang.org/x/oauth2"
)

func ApiGitHubUser(w http.ResponseWriter, r *http.Request) {
	context := r.Context()

	src := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: os.Getenv("GITHUB_TOKEN")},
	)
	httpClient := oauth2.NewClient(context, src)

	var query struct {
		Viewer struct {
			Login     githubv4.String
			CreatedAt githubv4.DateTime
		}
	}

	client := githubv4.NewClient(httpClient)

	err := client.Query(context, &query, nil)
	if err != nil {
		// Handle error.
	}

	fmt.Println("    Login:", query.Viewer.Login)
	fmt.Println("CreatedAt:", query.Viewer.CreatedAt)

	w.WriteHeader(200)
	w.Write([]byte("OK"))
}
