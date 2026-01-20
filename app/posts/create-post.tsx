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
import { cookies } from "next/headers";

export default async function CreatePostButton() {
  const cookieStore = await cookies();
  const currentUser = cookieStore.get("user_id")?.value;

  if (!currentUser) return <Button disabled>Create Post</Button>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create new post</DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Input id="post" placeholder="Enter post contents here"></Input>
          </div>
        </div>
        <DialogFooter className="sm:justify-start"></DialogFooter>
        <Button
          onClick={() => {
            createPost({
              user_id: currentUser,
              content: "Hello world",
            });
          }}
        ></Button>
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
