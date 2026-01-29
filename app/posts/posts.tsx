import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { fetchUser } from "../users/fetch";
import CreatePostButton from "./create-post";
import { fetchAllPosts } from "./fetch";
import PostsAndCommentsAndLikesListener from "./listener";
import { PostCard } from "./post-card";

export default async function Posts({
  cookies,
}: {
  cookies: ReadonlyRequestCookies;
}) {
  const { data: posts, error: postError } = await fetchAllPosts();
  const storedUserId = cookies.get("user_id")?.value ?? "";

  const { data: profile, error: userError } = await fetchUser({
    userId: storedUserId,
  });

  if (postError) return <div>Error retrieving posts: {postError.message}</div>;
  if (userError) return <div>Error retrieving user: {userError.message}</div>;
  if (!profile || !profile.id) return <div>No user selected</div>;

  return (
    <Card className="border-saffron/80 backdrop-blur-md bg-black/5 h-full overflow-y-auto">
      <PostsAndCommentsAndLikesListener />
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl">Posts</CardTitle>
        <CreatePostButton userId={profile.id} />
      </CardHeader>
      <Separator className="bg-saffron" />
      <div className="flex flex-col px-4 gap-8">
        <PostCard currentUserId={profile.id} posts={posts ?? []} />
      </div>
    </Card>
  );
}
