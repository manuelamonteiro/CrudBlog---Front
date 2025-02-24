"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeletePostProps {
  post: any;
  open: boolean;
  onClose: () => void;
  mutate: () => void;
}

export default function DeletePost({
  post,
  open,
  onClose,
  mutate
}: DeletePostProps) {
  const handleConfirmDelete = async () => {
    if (!post) return;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          toast.error("You are not authorized to perform this operation.");
        } else {
          toast.error(data.error || "Failed to create post.");
        }

        onClose();
        return;
      }

      toast.success("Post deleted successfully.");
      mutate();
      onClose();
    } catch (error) {
      toast.error("An unexpected error occurred.");
      onClose();
      console.error(error);
    }
  };

  if (!post) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
