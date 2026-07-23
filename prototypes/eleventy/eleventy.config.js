import toml from "@iarna/toml";

// Configure Eleventy
export default function(eleventyConfig) {
	eleventyConfig.setInputDirectory("content");
	eleventyConfig.setOutputDirectory("public");

	eleventyConfig.setIncludesDirectory("../src/includes");
	eleventyConfig.setLayoutsDirectory("../src/templates");

	eleventyConfig.addPassthroughCopy();

	// eleventyConfig.setQuietMode(true);

	eleventyConfig.setFrontMatterParsingOptions({
		engines: {
			toml: toml.parse.bind(toml),
		},
	});
};
