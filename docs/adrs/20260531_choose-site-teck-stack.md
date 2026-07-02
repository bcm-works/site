# Choose Site Tech Stack

## Status

**Accepted (31 May 2026)**

## Context

Building on top of [choose-repo-structure](choose-repo-structure.md).

My public website is used for various purposes, most importantly:

- To be a hub of links to my external profiles on other websites
- To host my blog posts
- To highlight my career and host a public version of my resume
- To demonstrate examples of how I build software and lead software teams

## Decision(s)

- Most files stored inside of `/src/site/`
- Shared high-level docs, designs and other artifacts in other top-level directories
- Docs in `/src/site/README.md` and supporting updates to `/README.md`
- Tech stack to match my skills:
  - Dev tooling in `/src/site/bin/` directory and shortcut commands set in `/justfile`
  - GitHub Actions
  - GCP
  - Docker
  - TypeScript
  - Deno
  - Lume (static site generator for Deno)

## Consequences

- Locked in to systems: GitHub, GCP
- Critically looking at the output of this system here, they are over-engineered for their intended use
