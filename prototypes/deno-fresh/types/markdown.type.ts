export interface MarkdownFrontMatter {
  url: string;
  oldUrl?: string;
  title: string;
  date: Date;
  tags?: string[];
}

export interface MarkdownContent {
  attrs: MarkdownFrontMatter | Record<string, unknown> | null;
  contentMarkdown: string;
  contentHtml: string;
}
