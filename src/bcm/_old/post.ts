import { format } from "date-fns";
import { writeFileSync as write } from "node:fs";
import { input as prompt } from "@inquirer/prompts";
import { logError, logSuccess } from "@/common/log.ts";

// Figure out the post date values based on the local machine's date

const dateNow: Date = new Date();
const dateSlug: string = format(dateNow, "yyyyMMdd");
const dateFrontmatter: string = format(dateNow, "yyyy-MM-dd");

// Prompt the user for the initial content

const postTitle: string = await prompt({ message: "Title of the new post:" });
const postTextSlug: string = await prompt({ message: "URL text slug for the new post:" });

if (!postTitle || !postTextSlug) {
  logError("Cancelled, both fields are required.");
  process.exit(1);
}

const postFile: string = `content/posts/${dateSlug}_${postTextSlug}.md`;

write(
  postFile,
  `--- \n\
title: ${postTitle} \n\
date: ${dateFrontmatter} \n\
url: /posts/${dateSlug}_${postTextSlug}/ \n\
tags: \n\
  - Post \n\
  -  \n\
--- \n\ \n\ \n\
`
);

logSuccess(`Finished, new file created at '${postFile}'`);
