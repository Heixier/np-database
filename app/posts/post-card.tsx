import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CommentWithUser, PostWithUserAndComments } from "@/types/extend";
import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

function CommentCard(props: { comments: CommentWithUser[] | null }) {
  const { comments } = props;

  if (!comments || comments.length === 0)
    return (
      <div className={cn("grid w-full justify-center")}>
        <Alert>
          <InfoIcon />
          <AlertTitle>No comments yet!</AlertTitle>
          <AlertDescription>Be the first to comment!</AlertDescription>
        </Alert>
      </div>
    );

  return (
    <div className="w-3/4">
      {comments.map((comment) => (
        <div key={comment.id}>
          <Card>
            <CardContent>
              <div className="flex flex-row items-center gap-2">
                <Avatar>
                  <AvatarFallback className="text-xs">
                    {comment.users?.username?.substring(0, 2).toUpperCase() ??
                      "?"}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="whitespace-nowrap shrink=0">
                  {comment.users?.username ?? "Anon"}
                </CardTitle>
                <p className="flex-1 truncate min-w-0">{comment.content}</p>
              </div>
              <CardFooter className="text-sm">
                {format(comment.created_at, "Pp")}
              </CardFooter>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

export function PostCard(props: { posts: PostWithUserAndComments[] }) {
  const { posts } = props;
  return (
    <div className="w-full">
      {posts.map((post) => (
        <div key={post.id}>
          <Card>
            <CardHeader className="flex flex-row justify-between">
              <CardTitle>{post.title}</CardTitle>
              <Avatar>
                <AvatarFallback className="text-xs">
                  {post.users?.username?.substring(0, 2).toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent>
              {post.content}
              <div className="flex justify-left">
                <CommentCard comments={post.comments}></CommentCard>
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
