import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import CreatePostButton from "./create-post";
import { fetchAllPosts } from "./fetch";
import PostsAndCommentsAndLikesListener from "./listener";
import { PostCard } from "./post-card";

export default async function Posts({ userId }: { userId: string }) {
  const { data: posts, error: postError } = await fetchAllPosts();

  if (postError) return <div>Error retrieving posts: {postError.message}</div>;

  return (
    <Card className="flex flex-col border-saffron/80 backdrop-blur-md bg-saffron/50 h-full">
      <PostsAndCommentsAndLikesListener />
      <CardHeader className="flex flex-row items-center justify-between flex-shrink-0 min-w-0">
        <CardTitle className="text-2xl min-w-0">Posts</CardTitle>
        <CreatePostButton userId={userId} />
      </CardHeader>
      <Separator className="bg-saffron flex-shrink-0" />
      <ScrollArea className="min-h-0">
        <div className="flex">
          <PostCard currentUserId={userId} posts={posts ?? []} />
        </div>
      </ScrollArea>
    </Card>
  );
}
