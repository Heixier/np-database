import { PostWithUserAndComments } from "@/types/extend";

import { PostContents } from "./post-contents";

export function PostCard({
  currentUserId,
  posts,
}: {
  currentUserId: string;
  posts: PostWithUserAndComments[];
}) {
  return (
    <div className="flex flex-col min-w-0 h-full w-0 grow gap-12">
      {posts.map((post) => (
        <PostContents key={post.id} post={post} currentUserId={currentUserId} />
      ))}
    </div>
  );
}
