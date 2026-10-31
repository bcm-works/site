const sentenceSegmenter = new Intl.Segmenter("en", { granularity: "sentence" });

function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/^\s*[-*>#]+\s+/gm, "")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function postDescription(markdown: string): string {
  const body = markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "");
  const text = toPlainText(body);

  return [...sentenceSegmenter.segment(text)]
    .slice(0, 2)
    .map(({ segment }) => segment.trim())
    .join(" ");
}

export function addPostDescription(markdown: string): string {
  if (/^description:\s*.+$/m.test(markdown)) return markdown;

  const description = JSON.stringify(postDescription(markdown));
  return markdown.replace(/^(---\s*\n)/, `$1description: ${description}\n`);
}
