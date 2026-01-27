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
    <div className="w-full min-w-0">
      {posts.map((post) => (
        <div key={post.id}>
          <PostContents post={post} currentUserId={currentUserId} />
        </div>
      ))}
    </div>
  );
}
