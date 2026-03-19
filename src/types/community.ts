export interface Comment {
  id: string;
  regionId: string;
  nickname: string;
  content: string;
  createdAt: number; // timestamp ms
  uid: string;
}

export interface CommentInput {
  regionId: string;
  content: string;
}
