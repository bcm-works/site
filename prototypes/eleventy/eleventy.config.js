import toml from "@iarna/toml";

// Configure Eleventy
export default function(eleventyConfig) {
	eleventyConfig.setInputDirectory("content");

	// These paths must be relative to the Input Directory
	eleventyConfig.setIncludesDirectory("../src/includes");
	eleventyConfig.setLayoutsDirectory("../src/templates");

	eleventyConfig.setOutputDirectory("public");

	// Copy "src/styles" to the Output Directory as a sub directory named "css"
	eleventyConfig.addPassthroughCopy({ "src/styles": "css" });

	eleventyConfig.addPassthroughCopy({ "content/images": "images" });
	eleventyConfig.addPassthroughCopy({ "content/favicon.ico": "favicon.ico" });
	eleventyConfig.addPassthroughCopy({ "content/resume.pdf": "resume.pdf" });
	eleventyConfig.addPassthroughCopy({ "src/pwa-manifest.json": "manifest.json" });
	// TODO: post json file goes here too - "posts.json": "posts.json"

	eleventyConfig.setQuietMode(true);

	eleventyConfig.setFrontMatterParsingOptions({
		engines: {
			toml: toml.parse.bind(toml),
		},
	});
};
