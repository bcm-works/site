package main

import (
	"fmt"
	"net/http"

	"github.com/shurcooL/githubv4"
	"golang.org/x/oauth2"
)

// GitHub API GraphQL query - User details and other public info
type GitHubUser struct {
	GitHubUser struct {
		Username string `graphql:"login"`
		Name     string `graphql:"name"`
		Status   struct {
			Message string `graphql:"message"`
		}
		Url   string `graphql:"url"`
		Repos struct {
			Count int `graphql:"totalCount"`
		} `graphql:"repositories(privacy: PUBLIC)"`
		Followers struct {
			Count int `graphql:"totalCount"`
		}
		Following struct {
			Count int `graphql:"totalCount"`
		}
	} `graphql:"user(login: \"bcm-works\")"`
}

// Use the GitHub API v4 and a GraphQL query to get public
// information about my GitHub user.
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

	result := query.GitHubUser

	// DEBUG
	// fmt.Printf("Query result: %+v \n", result)

	w.WriteHeader(200)

	// TODO: return as JSON and account for empty fields like result.Status.Message

	w.Write([]byte("User's name: " + result.Name))
}
