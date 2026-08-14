package main

import (
	"fmt"
	"net/http"

	"github.com/shurcooL/githubv4"
	"golang.org/x/oauth2"
)

var queryUser struct {
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

	src := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: githubToken},
	)

	httpClient := oauth2.NewClient(r.Context(), src)

	client := githubv4.NewClient(httpClient)

	err := client.Query(r.Context(), &queryUser, nil)
	if err != nil {
		fmt.Println("Error - API query failed - " + err.Error())

		w.WriteHeader(500)
		w.Write([]byte("SERVER ERROR"))
		return
	}

	w.WriteHeader(200)

	w.Write([]byte("User name: " + queryUser.user.name))
}
