import { Tables } from "@/database.types";

export type Post = Tables<"posts">;
export type Comment = Tables<"comments">;
export type Chat = Tables<"chats">;
export type Notificaton = Tables<"notifications">;
export type User = Tables<"users">;
export type UserStats = Tables<"user_stats">;
