"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateCommentProps {
  postId: number;
  open: boolean;
  onClose: () => void;
  mutate: () => void;
}

export default function CreateComment({
  postId,
  open,
  onClose,
  mutate,
}: CreateCommentProps) {
  const [content, setContent] = useState("");

  const handleConfirmCreate = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 422) {
            const errors = data as Record<string, string[]>;
            Object.values(errors).forEach((messages) => {
                messages.forEach((message) => toast.error(message));
            });
        } else if (res.status === 401 || res.status === 403) {
          toast.error("You are not authorized to create comments.");
        } else {
          toast.error(data?.error || "Failed to create comment.");
        }

        onClose();
        setContent("");
        return;
      }

      toast.success("Comment created successfully.");
      mutate();
      onClose();
      setContent("");
    } catch (error) {
      toast.error("An unexpected error occurred.");
      onClose();
      setContent("");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Comment</DialogTitle>
          <DialogDescription>
            Write the content of your comment below.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <textarea
            placeholder="Comment content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 rounded h-32"
          />
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              onClose();
              setContent("");
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmCreate}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
