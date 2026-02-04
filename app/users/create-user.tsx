"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldSet, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { KeyboardEvent, useState } from "react";
import { createUser } from "./actions";

export const CreateUser = () => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const createUserHandler = async () => {
    setLoading(true);
    try {
      const { error } = await createUser({
        username: username,
        bio: bio,
        media_url: mediaUrl,
      });
      if (error) throw new Error(error.message);
    } catch (e) {
      console.error(`Error: ${(e as Error).message}`);
    } finally {
      setUsername("");
      setBio("");
      setMediaUrl("");
      setLoading(false);
      setOpen(false);
      router.refresh();
    }
  };

  const handleInputKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!username || !bio) return;
    if (event.key === "Enter" && !event.shiftKey) createUserHandler();
  };

  // Clear contents when closing
  const handleSetOpen = (open: boolean) => {
    setOpen(open);
    setUsername("");
    setBio("");
    setMediaUrl("");
  };

  return (
    <Dialog open={open} onOpenChange={handleSetOpen}>
      <DialogTrigger asChild>
        <Button className="text-black font-bold from-pumpkin_spice-500/80 via-pumpkin_spice-600 to-pumpkin_spice-500/80 bg-transparent bg-gradient-to-r [background-size:300%_auto] hover:bg-transparent hover:bg-[99%_center] transition-all duration-500">
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent className="text-white flex w-full border-none from-black via-neutral-900 to-neutral-700 bg-gradient-to-tr">
        <DialogTitle className="sr-only"></DialogTitle>
        <FieldSet className="w-full">
          <FieldTitle className="flex flex-row items-center justify-between w-full pr-4">
            <div className="flex flex-row font-bold text-2xl gap-2 items-center">
              <p>Create User</p>
              <UserRound />
            </div>
            {username && (
              <Avatar>
                <AvatarImage src={mediaUrl ?? null} />
                <AvatarFallback className="text-black text-sm">
                  {username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </FieldTitle>
          <Field>
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-pumpkin_spice-400 focus:border-pumpkin_spice-400 focus-visible:ring-pumpkin_spice-400 selection:bg-white selection:text-black"
              onKeyDown={handleInputKeyPress}
            ></Input>
          </Field>
          <Field>
            <Input
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="border-pumpkin_spice-400 focus:border-pumpkin_spice-400 focus-visible:ring-pumpkin_spice-400 selection:bg-white selection:text-black"
              onKeyDown={handleInputKeyPress}
            ></Input>
          </Field>
          <Field>
            <Input
              placeholder="Avatar URL"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              className="border-pumpkin_spice-400 focus:border-pumpkin_spice-400 focus-visible:ring-pumpkin_spice-400 selection:bg-white selection:text-black"
              onKeyDown={handleInputKeyPress}
            ></Input>
          </Field>
          {loading ? (
            <div className="flex flex-row items-center justify-between">
              <p>Creating User...</p>
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <Button disabled={!username || !bio} onClick={createUserHandler}>
              Create
            </Button>
          )}
        </FieldSet>
      </DialogContent>
    </Dialog>
  );
};
