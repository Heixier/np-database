import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import Chats from "./chats/chats";
import Notifications from "./notifications/notifications";
import Posts from "./posts/posts";
import Users from "./users/users";

// Posts, users, messages (global chat), notifications
// move the posts listener back inside after removing the duplicate placeholders
export default async function Home() {
  const cookieStore = await cookies();

  return (
    <main
      className={cn(
        "w-full pt-2 pb-2 h-screen grid gap-4 px-2 grid-cols-1 sm:grid-cols-2 items-right",
        `bg-[url(/background.jpg)] bg-cover bg-center`,
      )}
    >
      <Posts cookies={cookieStore} />
      <Users cookies={cookieStore} />
      <Notifications cookies={cookieStore} />
      <Chats cookies={cookieStore} />
    </main>
  );
}
