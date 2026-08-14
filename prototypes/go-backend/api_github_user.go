package main

import (
	"fmt"
	"net/http"

	"github.com/shurcooL/githubv4"
	"golang.org/x/oauth2"
)

// GitHubGraphQLResponse mirrors the top-level JSON envelope
type GitHubGraphQLResponse struct {
	Data struct {
		User *GitHubUser `json:"user"`
	} `json:"data"`
}

// GitHubUser represents the inner user payload
type GitHubUser struct {
	User struct {
		Login  string `graphql:"login"`
		Name   string `graphql:"name"`
		Status struct {
			Message string `graphql:"message"`
		}
		HTMLURL      string `graphql:"url"`
		Repositories struct {
			TotalCount int `graphql:"totalCount"`
		} `graphql:"repositories(privacy: PUBLIC)"`
		Followers struct {
			TotalCount int `graphql:"totalCount"`
		}
		Following struct {
			TotalCount int `graphql:"totalCount"`
		}
	} `graphql:"user(login: \"bcm-works\")"`
}

func ApiGitHubUser(w http.ResponseWriter, r *http.Request) {
	githubToken := EnvGet("GITHUB_TOKEN", "")

	if githubToken == "" {
		fmt.Println("Error - GitHub token not found")

		w.WriteHeader(500)
		w.Write([]byte("SERVER ERROR"))
		return
	}

	src := oauth2.StaticTokenSource(&oauth2.Token{AccessToken: githubToken})
	httpClient := oauth2.NewClient(r.Context(), src)
	client := githubv4.NewClient(httpClient)

	query := GitHubUser{}

	err := client.Query(r.Context(), &query, nil)

	if err != nil {
		fmt.Println("Error - API query failed - " + err.Error())

		w.WriteHeader(500)
		w.Write([]byte("SERVER ERROR"))
		return
	}

	w.WriteHeader(200)

	w.Write([]byte("User's name: " + query.User.Name))
}
