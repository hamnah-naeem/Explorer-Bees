export interface Blog {
  id: number;
  title: string;
  category?: string;
  description?: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  authorImg: string;
  location?: string;
  tags: string[];
  content?: string[];
}
