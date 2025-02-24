"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Comment {
    id: number;
    post_id: number;
    content: string;
}

interface EditCommentProps {
    comment: Comment | null;
    open: boolean;
    onClose: () => void;
}

export default function EditComment({
    comment,
    open,
    onClose,
}: EditCommentProps) {
    const [content, setContent] = useState("");

    useEffect(() => {
        if (comment) {
            setContent(comment.content);
        }
    }, [comment]);

    const handleConfirmEdit = async () => {
        if (!comment) return;
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/posts/${comment.post_id}/comments/${comment.id}`,
                {
                    method: "PUT",
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
                    toast.error("You are not authorized to edit this comment.");
                } else {
                    toast.error(data?.error || "Failed to edit comment.");
                }
                
                onClose();
                return;
            }

            toast.success("Comment updated successfully.");
            onClose();
        } catch (error) {
            toast.error("An unexpected error occurred.");
            onClose();
            console.error(error);
        }
    };

    if (!comment) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Comment</DialogTitle>
                    <DialogDescription>
                        Modify the content of your comment.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <textarea
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full border p-2 rounded h-32"
                    />
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmEdit}>Save Changes</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
