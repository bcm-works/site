export interface MarkdownFrontMatter {
  url: string;
  oldUrl?: string;
  title: string;
  date: Date;
  tags?: string[];
}

export interface MarkdownPage {
  attrs: MarkdownFrontMatter | Record<string, unknown> | null;
  contentMarkdown: string;
  contentHtml: string;
}

export interface MarkdownContent {
  [slug: string]: MarkdownPage;
}

export type MarkdownContentList = MarkdownContent[] | [];
