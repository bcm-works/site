export interface MarkdownContent {
  url: string;
  oldUrl?: string;
  title: string;
  date: Date;
  tags?: string[];
  content: string;
}

export interface MarkdownFrontMatter {
  attrs: MarkdownContent;
  body: string;
}
