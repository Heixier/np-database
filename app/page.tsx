import { cookies } from "next/headers";
import Posts from "./posts/posts";
import Users from "./users/users";
import Notifications from "./notifications/notifications";
import Chats from "./chats/chats";

// Posts, users, messages (global chat), notifications
// move the posts listener back inside after removing the duplicate placeholders
export default async function Home() {
  const cookieStore = await cookies();

  return (
    <main className="w-full pt-2 pb-2 h-screen grid gap-4 grid-cols-1 sm:grid-cols-2 items-right">
      <Posts cookies={cookieStore} />
      <Users cookies={cookieStore} />
      <Notifications cookies={cookieStore} />
      <Chats cookies={cookieStore} />
    </main>
  );
}
