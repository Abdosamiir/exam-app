
export interface IComment {
  id: number;
  body: string;
  postId: number;
  likes: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  }
}

export interface ICommentResponse {
  comments: Array<IComment>;
  total: number;
  skip: number;
  limit: number;
}