import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PostWithUserAndComments } from "@/types/extend";
import { CreateCommentCard } from "./comment";
import { DeletePostButton } from "./delete-post";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { isLiked } from "./fetch";
import { LikeButton } from "./create-like";

export const PostContents = async ({
  post,
  currentUserId,
}: {
  post: PostWithUserAndComments;
  currentUserId: string;
}) => {
  const { data: liked } = await isLiked({
    post_id: post.id,
    user_id: currentUserId,
  });

  return (
    <Card className="min-w-0">
      <CardHeader className="flex flex-row justify-around items-center text-2xl px-0 gap-2">
        <Avatar>
          <AvatarFallback className="text-xs">
            {post.users?.username?.substring(0, 2).toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
        <CardTitle>{post.title}</CardTitle>
        {currentUserId !== post.user_id && (
          <LikeButton postId={post.id} userId={currentUserId} isLiked={liked} />
        )}
        {currentUserId === post.user_id && (
          <DeletePostButton postId={post.id} />
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 min-w-0">
        <Separator />
        <div className="flex flex-col gap-2">
          <span className="text-xs text-underlin">@{post.users?.username}</span>
          <span>{post.content}</span>
        </div>
        <Separator />
        <CreateCommentCard
          currentUserId={currentUserId}
          post={post}
        ></CreateCommentCard>
      </CardContent>
    </Card>
  );
};
