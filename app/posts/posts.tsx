import { cookies } from "next/headers";
import CreatePostButton from "./create-post";
import { fetchAllPosts } from "./fetch";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PostCard } from "./post-card";
import { fetchUser } from "../users/fetch";

export default async function Posts() {
  const { data: posts, error: postError } = await fetchAllPosts();
  const cookieStore = await cookies();
  const storedUserId = cookieStore.get("user_id")?.value ?? "";

  const { data: profile, error: userError } = await fetchUser({
    userId: storedUserId,
  });

  if (postError) return <div>Error retrieving posts: {postError.message}</div>;
  if (userError) return <div>Error retrieving user: {userError.message}</div>;
  if (!profile || !profile.id) return <div>No user selected</div>;

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Posts</CardTitle>
        <CreatePostButton userId={profile.id} />
      </CardHeader>
      <Separator />
      <div className="flex flex-col px-4 gap-8">
        <PostCard currentUserId={profile.id} posts={posts ?? []} />
      </div>
    </Card>
  );
}
