"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createPost } from "./actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostButton(props: { user_id: string }) {
  if (!props.user_id) return <Button disabled>Create Post</Button>;

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [title, setPostTitle] = useState("");
  const [content, setPostContent] = useState("");

  const handlePostCreation = async () => {
    setOpen(false);
	createPost({ user_id: props.user_id, title: title, content: content })
	router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">	
        <DialogHeader>
          <DialogTitle>Create new post</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Input value={title} placeholder="Enter post title" onChange={(e) => setPostTitle(e.target.value)} />
            <Input value={content} placeholder="Enter post contents" onChange={(e) => setPostContent(e.target.value)}></Input>
          </div>
        </div>
        <DialogFooter className="sm:justify-start"></DialogFooter>
        <Button
          onClick={handlePostCreation}
        >
          Create Post
        </Button>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
