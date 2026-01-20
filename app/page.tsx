import Posts from "./posts/posts";
import Users from "./users/users";

export default async function Home() {
  return (
    <main className="w-full h-screen grid gap-4 grid-cols-1 sm:grid-cols-2 items-right">
      <Posts />
      <Users />
      <Posts />
      <Posts />
    </main>
  );
}
