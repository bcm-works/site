package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/shurcooL/githubv4"
	"golang.org/x/oauth2"
)

type queryUser struct {
	user struct {
		login  githubv4.String
		name   githubv4.String
		status struct {
			message githubv4.String
		}
		url          githubv4.String
		repositories struct {
			totalCount githubv4.Int
		}
		followers struct {
			totalCount githubv4.Int
		}
		following struct {
			totalCount githubv4.Int
		}
	}
}

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

	query := queryUser{}

	client := githubv4.NewClient(httpClient)

	err := client.Query(r.Context(), &query, nil)
	if err != nil {
		w.WriteHeader(500)
		w.Write([]byte("SERVER ERROR"))
		return
	}

	fmt.Println("User login: ", query.user.login)
	fmt.Println("User name: ", query.user.name)

	w.WriteHeader(200)
	w.Write([]byte("OK"))
}
