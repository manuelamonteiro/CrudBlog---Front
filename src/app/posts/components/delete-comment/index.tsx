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

interface Comment {
    id: number;
    post_id: number;
    content: string;
}

interface DeleteCommentProps {
    comment: Comment | null;
    open: boolean;
    onClose: () => void;
}

export default function DeleteComment({
    comment,
    open,
    onClose,
}: DeleteCommentProps) {
    const handleConfirmDelete = async () => {
        if (!comment) return;
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/comments/${comment.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "application/json",
                    },
                }
            );

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    toast.error("You are not authorized to delete this comment.");
                } else {
                    toast.error("Failed to delete comment.");
                }
                return;
            }

            toast.success("Comment deleted successfully.");
            onClose();
        } catch (error) {
            toast.error("An unexpected error occurred.");
            console.error(error);
        }
    };

    if (!comment) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Comment</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this comment? This cannot be undone.
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
