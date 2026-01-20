import { Post, User, Comment } from "./tables";

export type CommentWithUsername = Comment & {
  users: { username: string };
};

export type PostWithCommentsAndUsernames = Post & {
  users: { username: string };
  comments: Array<CommentWithUsername>;
};

export type UserWithFollowCount = User;
