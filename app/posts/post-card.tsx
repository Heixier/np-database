"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PostWithUserAndComments } from "@/types/extend";
import { InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { createComment, deleteComment, deletePost } from "./actions";
import { Separator } from "@/components/ui/separator";

function CommentCard({
  currentUserId,
  post,
}: {
  currentUserId: string;
  post: PostWithUserAndComments | null;
}) {
  const [comment, setComment] = useState("");
  const [popOverOpen, setPopOverOpen] = useState(false);
  const comments = post?.comments;

  if (!post) {
    console.error("No way post is empty unless I coded stupid");
    return;
  }

  const sendCommentHandler = async () => {
    const result = await createComment({
      post_id: post.id,
      user_id: currentUserId,
      content: comment,
      replying_to: null,
    });

    setPopOverOpen(false);
    setComment("");

    if (result.error) {
      console.error(`Failed to send comment: ${result.error.message}`);
    }
  };

  const deleteCommentHandler = async (comment_id: string) => {
    await deleteComment({ comment_id: comment_id });
  };

  if (!comments || comments.length === 0)
    return (
      <div className={cn("w-full")}>
        <Popover open={popOverOpen} onOpenChange={setPopOverOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="hover:bg-opacity-0">
              <Alert>
                <InfoIcon />
                <AlertTitle>No comments yet!</AlertTitle>
                <AlertDescription>Be the first to comment!</AlertDescription>
              </Alert>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-col gap-4 px-4">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              placeholder="praise this post here"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={sendCommentHandler}
              disabled={!comment}
            >
              Submit
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    );

  return (
    <div className="w-full min-w-0">
      {comments.map((comment) => (
        <div key={comment.id}>
          <Card>
            <CardContent>
              <div className="flex flex-row items-center gap-2 min-w-0">
                <Avatar className="shrink-0">
                  <AvatarFallback className="text-xs">
                    {comment.users?.username?.substring(0, 2).toUpperCase() ??
                      "?"}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="whitespace-nowrap shrink-0">
                  {comment.users?.username ?? "Anon"}
                </CardTitle>
                <p className="flex-1 truncate min-w-0">{comment.content}</p>
              </div>
              <CardFooter className="flex-col xl:flex-row px-0 gap-4 text-sm">
                <div className="shrink-0 whitespace-nowrap">
                  {format(comment.created_at, "Pp")}
                </div>
                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={() => {
                    deleteCommentHandler(comment.id);
                  }}
                >
                  Delete Comment
                </Button>
              </CardFooter>
            </CardContent>
          </Card>
        </div>
      ))}
      <Popover open={popOverOpen} onOpenChange={setPopOverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">Create another comment</Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-4 px-4">
          <Label htmlFor="comment">Comment</Label>
          <Textarea
            id="comment"
            placeholder="praise this post here"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={sendCommentHandler}
            disabled={!comment}
          >
            Submit
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function PostCard({
  currentUserId,
  posts,
}: {
  currentUserId: string;
  posts: PostWithUserAndComments[];
}) {
  const deletePostHandler = async (post_id: string) => {
    await deletePost({ post_id: post_id });
  };
  return (
    <div className="w-full min-w-0">
      {posts.map((post) => (
        <div key={post.id}>
          <Card className="min-w-0">
            <CardHeader className="flex flex-row justify-between items-center text-2xl">
              <Avatar>
                <AvatarFallback className="text-xs">
                  {post.users?.username?.substring(0, 2).toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{post.title}</CardTitle>
              <Button
                variant="destructive"
                onClick={() => {
                  deletePostHandler(post.id);
                }}
              >
                Delete post
              </Button>
            </CardHeader>

            <CardContent className="grid gap-8 min-w-0">
              <Separator />

              {post.content}
              <Separator />
              <CommentCard
                currentUserId={currentUserId}
                post={post}
              ></CommentCard>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}
