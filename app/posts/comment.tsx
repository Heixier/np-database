"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { PostWithUserAndComments } from "@/types/extend";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  PlusCircleIcon,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useState } from "react";
import { createComment, deleteComment } from "./actions";

export const DeleteCommentButton = ({ comment_id }: { comment_id: string }) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const deleteCommentHandler = async () => {
    setLoading(true);
    try {
      const { error } = await deleteComment({ comment_id: comment_id });
      if (error) throw new Error(error.message);
    } catch (e) {
      console.error(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  return loading ? (
    <Loader2 className="animate-spin" />
  ) : (
    <Button
      variant="destructive"
      onClick={deleteCommentHandler}
      className="min-w-0 flex w-fit h-fit p-2"
    >
      <X />
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
  const [loading, setLoading] = useState(false);
  const [popOverOpen, setPopOverOpen] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);

  const comments = post?.comments;

  const router = useRouter();
  if (!post) {
    console.error("No way post is empty unless I coded stupid");
    return;
  }

  const keyDownHandler = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      createCommentHandler();
    }
  };

  const setCommentsVisibleToggle = () => {
    setCommentsVisible(!commentsVisible);
  };

  const createCommentHandler = async () => {
    if (!comment) return;
    setLoading(true);

    try {
      const { error } = await createComment({
        post_id: post.id,
        user_id: currentUserId,
        content: comment,
        replying_to: null,
      });
      if (error) throw new Error(error.message);
    } catch (e) {
      console.error(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
      setPopOverOpen(false);
      setCommentsVisible(true);
      setComment("");
      router.refresh();
    }
  };

  const setPopOverOpenHandler = (open: boolean) => {
    setPopOverOpen(open);
    setComment("");
  };

  return (
    <div className="w-full">
      <div className="flex flex-col w-full gap-4">
        <div className="flex gap-2 justify-between items-center">
          {comments && comments.length !== 0 && (
            <Button onClick={setCommentsVisibleToggle} className="w-fit">
              {!commentsVisible ? (
                <div className="flex gap-2 items-center">
                  <p>Show comments</p>
                  <ChevronDown />
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <p>Hide comments</p>
                  <ChevronUp />
                </div>
              )}
            </Button>
          )}

          <Popover open={popOverOpen} onOpenChange={setPopOverOpenHandler}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 text-white hover:text-white bg-transparent from-neutral-900 via-neutral-700 to-neutral-800 bg-gradient-to-r border-none self-center hover:bg-[99%_center] [background-size:300%_auto] transition-all duration-500"
              >
                <p>Create a comment!</p>
                <PlusCircleIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="border-none min-w-0 flex flex-col gap-4 px-4 from-neutral-900 to-neutral-700 bg-gradient-to-tr items-center">
              <Label htmlFor="comment" className="font-bold text-white text-lg">
                New Comment
              </Label>
              <Textarea
                id="comment"
                placeholder="praise this post here"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={keyDownHandler}
                className="border-none rounded-md bg-black/80 text-white h-32"
              />
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Button
                  variant="outline"
                  onClick={createCommentHandler}
                  disabled={!comment}
                  className="border-none text-neutral-200 hover:text-neutral-200 font-bold from-neutral-600 via-neutral-400/50 to-neutral-600 bg-gradient-to-r [background-size:300%_auto] hover:bg-transparent hover:bg-[99%_center] transition-all duration-500 border"
                >
                  Submit [Enter]
                </Button>
              )}
            </PopoverContent>
          </Popover>
        </div>
        {comments && comments.length !== 0 && commentsVisible && (
          <div className="flex flex-col gap-4 w-full min-w-0">
            {comments.map((comment) => (
              <div key={comment.id}>
                <Card className="bg-saffron-800/25 border-saffron/80">
                  <CardContent className="flex flex-col gap-4">
                    <div className="flex flex-row items-center gap-2 min-w-0 w-full justify-between">
                      <div className="flex gap-2 flex-col items-center">
                        <Avatar className="shrink-0">
                          <AvatarImage
                            src={comment.users?.media_url ?? ""}
                          ></AvatarImage>
                          <AvatarFallback className="text-xs">
                            {comment.users?.username
                              ?.substring(0, 2)
                              .toUpperCase() ?? "?"}
                          </AvatarFallback>
                        </Avatar>
                        <CardTitle className="whitespace-nowrap shrink-0">
                          @{comment.users?.username ?? "Anon"}
                        </CardTitle>
                      </div>
                      <div>
                        {currentUserId === comment.user_id && (
                          <DeleteCommentButton comment_id={comment.id} />
                        )}
                      </div>
                    </div>
                    <Separator className="bg-black/80" />
                    <p className="flex-1 break-words min-w-0">
                      {comment.content}
                    </p>
                    <div className="shrink-0 whitespace-nowrap text-xs">
                      {format(comment.created_at, "Pp")}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            <Button
              onClick={setCommentsVisibleToggle}
              className="w-fit self-center"
            >
              <div className="flex gap-2 items-center">
                <p>Hide comments</p>
                <ChevronUp />
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
