import { Tables } from "./supabase";

export type Post = Tables<"posts">;
export type Comment = Tables<"comments">;
export type Chat = Tables<"chats">;
export type Notificaton = Tables<"notifications">;
export type User = Tables<"users">;
export type UserView = Tables<"user_view">;
export type PostView = Tables<"post_view">;
export type NotificationWithSender = Tables<"notifications_with_sender_name">;
