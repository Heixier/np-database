"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createPost } from "./actions";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function CreatePostButton({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const [postContents, setPostContents] = useState("");
  const [titleContents, setTItleContents] = useState("");

  const handlePostCreation = async () => {
    const { error } = await createPost({
      user_id: userId,
      title: titleContents,
      content: postContents,
    });

    setOpen(false);
    setPostContents("");
    setTItleContents("");

    if (error) {
      console.error(`Error creating post: ${error.message}`);
    }
  };

  const handleSetOpen = async (open: boolean) => {
    setOpen(open);
    setPostContents("");
    setTItleContents("");
  };

  return (
    <Dialog open={open} onOpenChange={handleSetOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={!userId}
          className="text-black/80 from-orange-400/60 via-orange-200 to-orange-400/60 bg-transparent bg-gradient-to-r [background-size:300%_auto] hover:bg-transparent hover:bg-[99%_center] transition-all duration-500"
        >
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only"></DialogTitle>
        <FieldSet className="w-full max-w-sm">
          <FieldLegend className="font-bold">Create Post</FieldLegend>
          <Field>
            <FieldLabel htmlFor="post_title">Post Title</FieldLabel>
            <Input
              id="post_title"
              type="text"
              placeholder="Enter post title"
              value={titleContents}
              onChange={(e) => {
                setTItleContents(e.target.value);
              }}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="post_contents">Post Contents</FieldLabel>
            <Textarea
              id="post_contents"
              placeholder="Enter post contents"
              value={postContents}
              onChange={(e) => {
                setPostContents(e.target.value);
              }}
            ></Textarea>
            <Button
              onClick={handlePostCreation}
              disabled={
                postContents.trim() === "" || titleContents.trim() === ""
              }
            >
              Create Post
            </Button>
          </Field>
        </FieldSet>
        <DialogFooter className="sm:justify-start"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
