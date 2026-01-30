import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import Chats from "./chats/chats";
import Notifications from "./notifications/notifications";
import Posts from "./posts/posts";
import { fetchUser } from "./users/fetch";
import Users from "./users/users";

// Posts, users, messages (global chat), notifications
// move the posts listener back inside after removing the duplicate placeholders
export default async function Home() {
  const cookieStore = await cookies();

  const storedUserId = cookieStore.get("user_id")?.value ?? "";
  const { data: profile, error: userError } = await fetchUser({
    userId: storedUserId,
  });

  if (userError) console.error(`Error loading user: ${userError.message}`);

  return (
    <main
      className={cn(
        "min-w-0 min-h-0 w-full pt-2 pb-2 h-screen grid gap-4 p-4 grid-rows-2 grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 items-right",
        `bg-[url(/background.jpg)] bg-cover bg-center`,
      )}
    >
      {profile?.id && <Posts userId={profile.id} />}
      <Users userId={profile?.id} />
      {profile?.id && <Notifications userId={profile.id} />}
      {profile?.id && <Chats userId={profile.id} />}
    </main>
  );
}
