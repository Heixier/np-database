import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PostWithUserAndComments } from "@/types/extend";
import { CommentCard } from "./comment";
import { LikeButton } from "./create-like";
import { DeletePostButton } from "./delete-post";
import { isLiked } from "./fetch";

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
    <Card className="border-saffron/80 bg-saffron/15 min-w-0">
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
        <Separator className="bg-saffron" />
        <div className="flex flex-col gap-2">
          <span className="text-xs">@{post.users?.username}</span>
          <span>{post.content}</span>
        </div>
        <Separator className="bg-saffron" />
        <CommentCard currentUserId={currentUserId} post={post}></CommentCard>
      </CardContent>
    </Card>
  );
};
