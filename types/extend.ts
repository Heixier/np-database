import { Post, Comment } from "./tables";

export type CommentWithUsername = Comment & {
  users: { username: string };
};

export type PostWithCommentsAndUsernames = Post & {
  users: { username: string };
  comments: Array<CommentWithUsername>;
};

export interface UserUsername {
	username: string | null
}

export interface CommentWithUser extends Comment {
	users: UserUsername | null
}

export interface PostWithUserAndComments extends Post {
	users: UserUsername | null
	comments: CommentWithUser[] | null
}