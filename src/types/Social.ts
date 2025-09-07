export interface Poll {
  options: string[];
  votes: number[];
  totalVotes: number;
}

export interface Reply {
  id: number;
  name: string;
  handle: string;
  content: string;
  time: string;
}

export interface PostType {
  id: number;
  name: string;
  username: string;
  description: string;
  time: string;
  total_likes: number;
  total_reposts: number;
  total_comments: number;
  image?: string;
  poll?: Poll;
  user_image?: string;
  repliesList?: Reply[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export interface NewPostData {
  content: string;
  image?: string | null;
  poll?: { options: string[] } | null;
}
