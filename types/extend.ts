import { Chat, Comment, Post } from "./tables";

export interface UserDetails {
  username: string | null;
  media_url: string | null;
}

export interface CommentWithUser extends Comment {
  users: UserDetails | null;
}

export interface PostWithUserAndComments extends Post {
  users: UserDetails | null;
  comments: CommentWithUser[] | null;
}

export interface ChatWithUser extends Chat {
  users: UserDetails | null;
}
