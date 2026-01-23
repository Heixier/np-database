import { cookies } from "next/headers";
import CreatePostButton from "./create-post";
import { fetchAllPosts } from "./fetch";
import { PostWithCommentsAndUsernames } from "@/types/extend";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PostCard from "./post-card";

export default async function Posts() {
  const { data: posts, error } = await fetchAllPosts();
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get("user_id")?.value;

  if (error) return <div>Database error: {error.message}</div>;
  if (!posts) return <div>No posts to show</div>;

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Posts</CardTitle>
        <CreatePostButton user_id={currentUserId ?? ""} />
      </CardHeader>
      <Separator />
      <PostCard posts={posts} />
    </Card>
  );
}
