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
    <Card className="min-w-0 border-none from-saffron-500 to-saffron-700 bg-gradient-to-tr w-full flex flex-col text-sm">
      <CardHeader className="min-w-0 h-fit flex flex-row items-center px-8 justify-between">
        <div className="flex flex-col items-center">
          <Avatar>
            <AvatarImage src={post.users?.media_url ?? ""} />
            <AvatarFallback className="text-xs bg-saffron-800/80">
              {post.users?.username?.substring(0, 2).toUpperCase() ?? "?"}
            </AvatarFallback>
          </Avatar>
          <p className="font-bold truncate text-sm">@{post.users?.username}</p>
        </div>
        <CardTitle className="truncate min-w-0 text-3xl pl-4 flex-1">
          {post.title}
        </CardTitle>
        <div>
          {currentUserId !== post.user_id && (
            <LikeButton
              postId={post.id}
              userId={currentUserId}
              isLiked={liked}
            />
          )}
          {currentUserId === post.user_id && (
            <DeletePostButton postId={post.id} />
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 min-w-0 items-center">
        <Separator className="bg-black/80" />
        <p className="rounded-md from-neutral-900/90 to-neutral-800/90 bg-gradient-to-tr py-2 px-4 break-words w-full text-left min-w-0 text-white">
          {post.content}
        </p>
        <Separator className="bg-black/80" />
        <CommentCard currentUserId={currentUserId} post={post}></CommentCard>
      </CardContent>
    </Card>
  );
};
