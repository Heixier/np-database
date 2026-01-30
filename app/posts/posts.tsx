import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreatePostButton from "./create-post";
import { fetchAllPosts } from "./fetch";
import PostsAndCommentsAndLikesListener from "./listener";
import { PostCard } from "./post-card";

export default async function Posts({ userId }: { userId: string }) {
  const { data: posts, error: postError } = await fetchAllPosts();

  if (postError) return <div>Error retrieving posts: {postError.message}</div>;

  return (
    <Card className="flex flex-col border-saffron/80 backdrop-blur-md bg-saffron/50 h-full px-4">
      <PostsAndCommentsAndLikesListener />
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl min-w-0">Posts</CardTitle>
        <CreatePostButton userId={userId} />
      </CardHeader>
      <Card className="flex h-full min-h-0 bg-transparent p-0 border-saffron/80">
        <CardContent className="bg-transparent flex flex-col min-h-0 px-0">
          <ScrollArea className="min-h-0">
            <div className="flex">
              <PostCard currentUserId={userId} posts={posts ?? []} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </Card>
  );
}
