import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteUser } from "./actions";

export default function DeleteUserButton({
  currentUserId,
  userId,
}: {
  currentUserId: string;
  userId: string;
}) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      const { error } = await deleteUser({ userId });
      if (error) throw new Error(error.message);
    } catch (e) {
      console.error(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="w-fit overflow-hidden">
      {loading ? (
        <Loader2 className="animate-spin w-full" />
      ) : (
        <Button
          variant="destructive"
          onClick={handleDeleteUser}
          disabled={currentUserId !== userId}
          className="w-fit"
        >
          <Trash2 className="w-fit" />
          Delete
        </Button>
      )}
    </div>
  );
}
