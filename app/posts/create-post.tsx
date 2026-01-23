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
import { DialogDescription } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";

export default function CreatePostButton(props: { user_id: string }) {
  if (!props.user_id) return <Button disabled>Create Post</Button>;

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [postContents, setPostContents] = useState("");
  const [titleContents, setTItleContents] = useState("");

  const handlePostCreation = async () => {
    await createPost({
      user_id: props.user_id,
      title: titleContents,
      content: postContents,
    });

    router.refresh();
    setOpen(false);
    setPostContents("");
    setTItleContents("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!props.user_id} variant="outline">
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">
          Create Post Dialog Window
          <DialogDescription>
            Dialog window for creating posts with title and content input fields
          </DialogDescription>
        </DialogTitle>
        <FieldSet className="w-full max-w-sm">
          <FieldLegend className="font-bold">Create Post</FieldLegend>
          <Field>
            <FieldLabel htmlFor="post_title">Post Title</FieldLabel>
            <Input
              id="post_title"
              type="text"
              placeholder="I totally love frontend design"
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
              placeholder="Enter post contents here"
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
