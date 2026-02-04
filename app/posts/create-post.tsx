"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useState } from "react";
import { createPost } from "./actions";

export default function CreatePostButton({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [postContents, setPostContents] = useState("");
  const [titleContents, setTitleContents] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleInputKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handlePostCreation();
    }
  };

  const handleTextareaKeyPress = (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handlePostCreation();
    }
  };

  const handlePostCreation = async () => {
    if (!postContents || !titleContents) return;

    setLoading(true);

    try {
      const { error } = await createPost({
        user_id: userId,
        title: titleContents,
        content: postContents,
      });

      if (error) throw new Error(error.message);
    } catch (e) {
      console.error(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
      setOpen(false);
      setPostContents("");
      setTitleContents("");
      router.refresh();
    }
  };

  const handleSetOpen = async (open: boolean) => {
    setOpen(open);
    setPostContents("");
    setTitleContents("");
  };

  return (
    <Dialog open={open} onOpenChange={handleSetOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={!userId}
          className="text-black font-bold from-saffron-500/80 via-saffron-600 to-saffron-500/80 bg-transparent bg-gradient-to-r [background-size:300%_auto] hover:bg-transparent hover:bg-[99%_center] transition-all duration-500"
        >
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="text-white flex w-full border-none from-black via-neutral-900 to-neutral-700 bg-gradient-to-tr">
        <DialogTitle className="sr-only"></DialogTitle>
        <FieldSet className="w-full">
          <FieldTitle className="font-bold text-2xl">Create Post</FieldTitle>
          <Field>
            <FieldLabel htmlFor="post_title">Title</FieldLabel>
            <Input
              id="post_title"
              type="text"
              placeholder="Enter post title"
              value={titleContents}
              onChange={(e) => {
                setTitleContents(e.target.value);
              }}
              className="border-white focus:border-white focus-visible:ring-white selection:bg-white selection:text-black"
              onKeyDown={handleInputKeyPress}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="post_contents">Contents</FieldLabel>
            <Textarea
              id="post_contents"
              placeholder="Enter post contents"
              value={postContents}
              onChange={(e) => {
                setPostContents(e.target.value);
              }}
              className="border-white focus:border-white focus-visible:ring-white selection:bg-white selection:text-black"
              onKeyDown={handleTextareaKeyPress}
            ></Textarea>
            {loading ? (
              <div className="flex gap-2 items-center w-full justify-between">
                <p>Creating Post ...</p>
                <Loader2 className="animate-spin" />
              </div>
            ) : (
              <Button
                onClick={handlePostCreation}
                disabled={
                  postContents.trim() === "" || titleContents.trim() === ""
                }
              >
                Create Post
              </Button>
            )}
          </Field>
        </FieldSet>
        <DialogFooter className="sm:justify-start"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
