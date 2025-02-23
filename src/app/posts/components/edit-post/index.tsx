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

interface EditPostProps {
    post: any;
    open: boolean;
    onClose: () => void;
}

export default function EditPost({
    post,
    open,
    onClose,
}: EditPostProps) {
    const [formData, setFormData] = useState({ title: "", content: "" });

    useEffect(() => {
        if (post) {
            setFormData({ title: post.title, content: post.content });
        }
    }, [post]);

    const handleConfirmEdit = async () => {
        if (!post) return;
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${post.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 422) {
                    const errors = data as Record<string, string[]>;
                    Object.values(errors).forEach((messages) => {
                        messages.forEach((message) => toast.error(message));
                    });
                } else if (res.status === 403) {
                    toast.error("You are not authorized to perform this operation.");
                } else {
                    toast.error(data.error || "Failed to create post.");
                }

                onClose();
                return;
            }

            toast.success("Post updated successfully.");
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
                    <DialogTitle>Edit Post</DialogTitle>
                    <DialogDescription>
                        Modify the title and content of your post.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Title"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full border p-2 rounded"
                    />
                    <textarea
                        placeholder="Content"
                        value={formData.content}
                        onChange={(e) =>
                            setFormData({ ...formData, content: e.target.value })
                        }
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
