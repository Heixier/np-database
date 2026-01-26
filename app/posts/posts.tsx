import { cookies } from "next/headers";
import CreatePostButton from "./create-post";
import { fetchAllPosts } from "./fetch";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PostCard } from "./post-card";

export default async function Posts() {
  const { data: posts, error } = await fetchAllPosts();
  const cookieStore = await cookies();
  const currentUserId = cookieStore.get("user_id")?.value ?? "";

  if (error) return <div>Database error: {error.message}</div>;
  if (!currentUserId) return <div>No user selected</div>;

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Posts</CardTitle>
        <CreatePostButton user_id={currentUserId ?? ""} />
      </CardHeader>
      <Separator />
      <div className="flex flex-col px-4 gap-8">
        <PostCard currentUserId={currentUserId} posts={posts ?? []} />
      </div>
    </Card>
  );
}
