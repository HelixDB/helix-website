export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
  author: string;
  coverImage?: string;
  tags?: string[];
  readingTime?: string;
}

export interface BlogMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  coverImage?: string;
  tags?: string[];
  readingTime?: string;
} 