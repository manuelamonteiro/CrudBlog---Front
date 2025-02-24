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
    DialogTrigger,
} from "@/components/ui/dialog";

interface CreatePostProps {
    mutate: () => void;
}

export default function CreatePost({
    mutate,
}: CreatePostProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({ title: "", content: "" });

    const handleConfirmCreate = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
                method: "POST",
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
                } else if (res.status === 401 || res.status === 403) {
                    toast.error("You are not authorized to perform this operation.");
                } else {
                    toast.error(data.error || "Failed to create post.");
                }

                setOpen(false);
                setFormData({ title: "", content: "" });
                return;
            }

            toast.success("Post created successfully.");
            mutate();
            setOpen(false);
            setFormData({ title: "", content: "" });
        } catch (error) {
            toast.error("An unexpected error occurred.");
            setOpen(false);
            setFormData({ title: "", content: "" });
            console.error(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Post</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Post</DialogTitle>
                    <DialogDescription>
                        Enter the post title and content below.
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
                    <Button
                        variant="outline"
                        onClick={() => {
                            setOpen(false);
                            setFormData({ title: "", content: "" });
                        }}
                    >
                        Leave & Discard
                    </Button>
                    <Button onClick={handleConfirmCreate}>Confirm</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
