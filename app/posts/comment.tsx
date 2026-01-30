"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { PostWithUserAndComments } from "@/types/extend";
import { format } from "date-fns";
import { useState } from "react";
import { createComment, deleteComment } from "./actions";

export const DeleteCommentButton = ({ comment_id }: { comment_id: string }) => {
  const deleteCommentHandler = async () => {
    const { error } = await deleteComment({ comment_id: comment_id });

    if (error) {
      console.error(`Error deleting comment: ${error.message}`);
    }
  };

  return (
    <Button variant="destructive" onClick={deleteCommentHandler}>
      Delete Comment
    </Button>
  );
};

export const CommentCard = ({
  currentUserId,
  post,
}: {
  currentUserId: string;
  post: PostWithUserAndComments | null;
}) => {
  const [comment, setComment] = useState("");
  const [popOverOpen, setPopOverOpen] = useState(false);
  const comments = post?.comments;

  if (!post) {
    console.error("No way post is empty unless I coded stupid");
    return;
  }

  const createCommentHandler = async () => {
    const { error } = await createComment({
      post_id: post.id,
      user_id: currentUserId,
      content: comment,
      replying_to: null,
    });

    setPopOverOpen(false);
    setComment("");

    if (error) {
      console.error(`Error creating comment: ${error.message}`);
    }
  };

  const setPopOverOpenHandler = (open: boolean) => {
    setPopOverOpen(open);
    setComment("");
  };

  if (!comments || comments.length === 0)
    return (
      <Popover open={popOverOpen} onOpenChange={setPopOverOpenHandler}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="hover:bg-opacity-0">
            <Alert className="flex flex-1 gap-8 items-center justify-left bg-white/60 hover:bg-white/80">
              <AlertTitle>No comments yet!</AlertTitle>
              <AlertDescription>Be the first to comment!</AlertDescription>
            </Alert>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-0 flex flex-col gap-4 px-4 bg-electric_indigo-800">
          <Label htmlFor="comment" className="font-bold text-md">
            Comment
          </Label>
          <Textarea
            id="comment"
            className="border-none"
            placeholder="praise this post here"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={createCommentHandler}
            disabled={!comment}
          >
            Submit
          </Button>
        </PopoverContent>
      </Popover>
    );

  return (
    <div className="flex flex-col gap-4 w-full min-w-0">
      {comments.map((comment) => (
        <div key={comment.id}>
          <Card className="bg-saffron-800/25 border-saffron/80">
            <CardContent className="flex flex-row items-center gap-4 justify-between">
              <div>
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
                  <p className="flex-1 break-words min-w-0">
                    {comment.content}
                  </p>
                </div>
                <div className="shrink-0 whitespace-nowrap">
                  {format(comment.created_at, "Pp")}
                </div>
              </div>

              {currentUserId === comment.user_id && (
                <DeleteCommentButton comment_id={comment.id} />
              )}
            </CardContent>
          </Card>
        </div>
      ))}
      <Popover open={popOverOpen} onOpenChange={setPopOverOpenHandler}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-white/60 hover:bg-white/80">
            Create another comment
          </Button>
        </PopoverTrigger>
        <PopoverContent className="min-w-0 flex flex-col gap-4 px-4 bg-electric_indigo-800">
          <Label htmlFor="comment">Comment</Label>
          <Textarea
            id="comment"
            placeholder="praise this post here"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            variant="outline"
            onClick={createCommentHandler}
            disabled={!comment}
          >
            Submit
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};
