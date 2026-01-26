import PostsAndCommentsListener from "./posts/listener";
import Posts from "./posts/posts";
import Users from "./users/users";

// Posts, users, messages (global chat), notifications
export default async function Home() {
  return (
    <main className="w-full pt-2 h-screen grid gap-4 grid-cols-1 sm:grid-cols-2 items-right">
      <PostsAndCommentsListener />
      <Posts />
      <Users />
      <Posts />
      <Posts />
    </main>
  );
}
