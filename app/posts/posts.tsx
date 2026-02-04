import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StickyNote } from "lucide-react";
import CreatePostButton from "./create-post";
import { fetchAllPosts } from "./fetch";
import { PostCard } from "./post-card";

export default async function Posts({ userId }: { userId: string }) {
  const { data: posts, error: postError } = await fetchAllPosts();

  if (postError) return <div>Error retrieving posts: {postError.message}</div>;

  return (
    <Card className="flex flex-col border-none backdrop-blur-md bg-saffron/50 h-full px-4">
      {/* <PostsAndCommentsAndLikesListener /> */}
      <CardHeader className="flex flex-row items-center justify-between px-2">
        <CardTitle className="flex flex-row gap-2 items-center text-2xl">
          <p>Posts</p>
          <StickyNote
            className="fill-white stroke-saffron-600"
            size={32}
            strokeWidth={2}
          />
        </CardTitle>
        <CreatePostButton userId={userId} />
      </CardHeader>
      <Card className="flex h-full min-h-0 bg-black/80 p-0 border-none">
        <CardContent className="flex flex-col min-h-0 px-0 h-full">
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
