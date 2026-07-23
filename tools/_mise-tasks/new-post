#!/usr/bin/env bash
#MISE description="Generate a Markdown file for a new post item"

# Figure out the post date values based on the local machine's date

date_slug="$(date +%Y%m%d)"
date_prop="$(date +%Y-%m-%d)"

# Prompt the user for the initial content

read -p "Title of the new post: " post_title

read -p "URL text slug for the new post: " post_text_slug

if [[ -z "$post_title" || -z "$post_text_slug" ]]; then
  mise run msg-error 'Cancelled, both post title and slug fields are required.'
  exit 1
fi

post_file="./content/posts/${date_slug}_${post_text_slug}.md"

cat > "$post_file" << EOF
---
title: ${post_title}
date: ${date_prop}
url: /posts/${date_slug}_${post_text_slug}/
tags:
  - Post
  -
---


EOF

mise run msg-success "Finished, new file created at '${post_file}'"
