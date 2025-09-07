export interface Question {
  id: number;
  title: string;
  content: string;
  author: string;
  votes: number;
  answers: number;
  views: number;
  topics: string[];
  time: string;
  isUpvoted: boolean;
  isDownvoted: boolean;
  userImage: string;
}
