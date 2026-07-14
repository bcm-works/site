export interface MarkdownFrontMatter {
  url: string;
  oldUrl?: string;
  title: string;
  date: Date;
  tags?: string[];
}

export interface MarkdownContent {
  attrs: MarkdownFrontMatter;
  contentMarkdown: string;
  contentHtml: string;
}
