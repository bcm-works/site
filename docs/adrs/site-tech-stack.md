# Site: Tech Stack

## Status

**Accepted (31 May 2026)**

## Context

My public website is used for various purposes, most importantly:

- To be a hub of links to my external profiles on other websites
- To host my blog posts
- To highlight my career and host a public version of my resume
- To demonstrate examples of how I build software and lead software teams

Skills I most want to highlight here:

- Documentation
- Dev tooling, including AI Code Gen configuration
- Technical writing

## Decision(s)

- Monorepo style inside of `src/`
- Shared high-level docs, designs and other artifacts in other top-level directories
- Dev tooling and AI Code Gen configuration at the top level
- Docs in Markdown format that follow a logical structure, and link to each other when relevant
- Tech stack to match my skills:
  - Public repository on GitHub
  - Dev tooling at the top level `bin/` directory and other appropriate locations
  - GitHub Actions
  - GCP
  - Docker
  - TypeScript
  - Deno
  - Lume (static site generator for Deno)

## Consequences

- Skills in other tech areas, such as infra and code hosting providers, are not covered
- Critically looking at the output of the systems here, they are over-engineered for their intended use
