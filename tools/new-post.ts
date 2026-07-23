import { execSync as run } from 'node:child_process';
import { writeFileSync as write } from 'node:fs';
import { input as prompt } from '@inquirer/prompts';
import { info, success, warn, error } from '#tools/log';

// Figure out the post date values based on the local machine's date

const dateSlug: string = run('date +%Y%m%d').toString().trim();
const dateFrontmatter: string = run('date +%Y-%m-%d').toString().trim();

// Prompt the user for the initial content

const postTitle: string = await prompt({ message: "Title of the new post:" });
const postTextSlug: string = await prompt({ message: "URL text slug for the new post:" });

if (!postTitle || !postTextSlug) {
  error("Cancelled, both fields are required.");
  process.exit(1);
}

const postFile: string = `content/posts/${dateSlug}_${postTextSlug}.md`;

write(postFile, `--- \n\
title: ${postTitle} \n\
date: ${dateFrontmatter} \n\
url: /posts/${dateSlug}_${postTextSlug}/ \n\
tags: \n\
  - Post \n\
  -  \n\
--- \n\ \n\ \n\
`);

success(`Finished, new file created at '${postFile}'`);
