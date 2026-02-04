import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <Card className="min-w-0 border-saffron/80 bg-saffron/60 w-full flex flex-col">
      <CardHeader className="min-w-0 h-12 flex-shrink-0 flex flex-row items-center text-2xl px-8 gap-8">
        <Avatar>
          <AvatarImage src={post.users?.media_url ?? ""} />
          <AvatarFallback className="text-xs bg-saffron-800/80">
            {post.users?.username?.substring(0, 2).toUpperCase() ?? "?"}
          </AvatarFallback>
        </Avatar>
        <p className="font-bold truncate text-sm">@{post.users?.username}</p>
        <CardTitle className="truncate flex-1 min-w-0 text-center text-4xl text-left px-2">
          {post.title}
        </CardTitle>
        {currentUserId !== post.user_id && (
          <LikeButton postId={post.id} userId={currentUserId} isLiked={liked} />
        )}
        {currentUserId === post.user_id && (
          <DeletePostButton postId={post.id} />
        )}
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 min-w-0">
        <Separator className="bg-saffron" />
        <div className="min-w-0 w-full">
          <p className="break-words w-full min-w-0">{post.content}</p>
        </div>
        <Separator className="bg-saffron" />
        <CommentCard currentUserId={currentUserId} post={post}></CommentCard>
      </CardContent>
    </Card>
  );
};
