package main

import (
	"fmt"
	"net/http"

	"github.com/shurcooL/githubv4"
	"golang.org/x/oauth2"
)

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

	var query struct {
		user struct {
			login  string
			name   string
			status struct {
				message string
			}
			url          string
			repositories struct {
				totalCount int
			}
			followers struct {
				totalCount int
			}
			following struct {
				totalCount int
			}
		} `graphql:"user(login: \"bcm-works\"), repositories(privacy: \"PUBLIC\")"`
	}

	err := client.Query(r.Context(), &query, nil)

	if err != nil {
		fmt.Println("Error - API query failed - " + err.Error())

		w.WriteHeader(500)
		w.Write([]byte("SERVER ERROR"))
		return
	}

	fmt.Println(query)

	w.WriteHeader(200)

	// w.Write([]byte("User's name: " + query.user.name))
}
