
export interface IPost {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
}

export interface IPostResponse {
  posts: Array<IPost>;
  total: number;
  skip: number;
  limit: number;
}