"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { createUser } from "./actions";

export const CreateUser = () => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const createUserHandler = async () => {
    const { error } = await createUser({ username: username, bio: bio });

    if (error) {
      console.error(`Failed to create user: ${error.message}`);
    }
    setOpen(false);
    setUsername("");
    setBio("");
  };

  // Clear contents when closing
  const handleSetOpen = (open: boolean) => {
    setOpen(open);
    setUsername("");
    setBio("");
  };

  return (
    <Dialog open={open} onOpenChange={handleSetOpen}>
      <DialogTrigger asChild>
        {/* WAY TOO MUCH EFFORT BRO */}
        <Button className="text-black from-blue-400/60 via-blue-200 to-blue-400/60 bg-transparent bg-gradient-to-r [background-size:300%_auto] hover:bg-transparent hover:bg-[99%_center] transition-all duration-500">
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create new user</DialogTitle>
        <FieldSet>
          <Field>
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></Input>
          </Field>
          <Field>
            <Input
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></Input>
          </Field>
          <Button disabled={!username || !bio} onClick={createUserHandler}>
            Create
          </Button>
        </FieldSet>
      </DialogContent>
    </Dialog>
  );
};
