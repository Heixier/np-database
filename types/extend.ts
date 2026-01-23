import { Comment, Post } from "./tables";

export interface UserUsername {
  username: string | null;
}

export interface CommentWithUser extends Comment {
  users: UserUsername | null;
}

export interface PostWithUserAndComments extends Post {
  comments: CommentWithUser[] | null;
}
