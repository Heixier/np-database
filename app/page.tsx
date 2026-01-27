import PostsAndCommentsAndLikesListener from "./posts/listener";
import Posts from "./posts/posts";
import Users from "./users/users";

// Posts, users, messages (global chat), notifications
// move the posts listener back inside after removing the duplicate placeholders
export default async function Home() {
  return (
    <main className="w-full pt-2 h-screen grid gap-4 grid-cols-1 sm:grid-cols-2 items-right">
      <PostsAndCommentsAndLikesListener />
      <Posts />
      <Users />
      <Posts />
      <Posts />
    </main>
  );
}
