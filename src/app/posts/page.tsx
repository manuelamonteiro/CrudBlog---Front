"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreatePost from "./components/create-post";
import EditPost from "./components/edit-post";
import DeletePost from "./components/delete-post";

interface Comment {
    id: number;
    content: string;
    post_id: number;
    user_id: number;
}

interface Post {
    id: number;
    title: string;
    content: string;
    user: { id: number; name: string; email: string };
    comments: Comment[];
}

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>({});
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const fetchPosts = async () => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;

        try {
            const res = await fetch(`${baseUrl}/posts`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            const data = await res.json();

            if (res.ok) {
                setPosts(data);
            } else if (res.status === 422) {
                const errors = data as Record<string, string[]>;
                Object.values(errors).forEach((messages) => {
                    messages.forEach((message) => toast.error(message));
                });
            } else {
                toast.error(data.error || "Error fetching posts.");
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const toggleExpand = (postId: number) => {
        setExpandedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
    };

    const onEditClick = (post: Post) => {
        setSelectedPost(post);
        setEditOpen(true);
    };

    const onDeleteClick = (post: Post) => {
        setSelectedPost(post);
        setDeleteOpen(true);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-end mb-4">
                <CreatePost />
            </div>

            {loading ? (
                <div>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-44 bg-gray-200 rounded animate-pulse mb-6"></div>
                    ))}
                </div>
            ) : posts.length === 0 ? (
                <p className="text-center text-gray-600">No posts available.</p>
            ) : (
                posts.map((post) => (
                    <Card key={post.id} className="mb-6">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-xl">{post.title}</CardTitle>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost">⋮</Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onSelect={() => onEditClick(post)}
                                            className="cursor-pointer"
                                        >
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onSelect={() => onDeleteClick(post)}
                                            className="cursor-pointer"
                                        >
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p>{post.content}</p>
                            <Button
                                variant="ghost"
                                onClick={() => toggleExpand(post.id)}
                                className="mt-2"
                            >
                                {expandedPosts[post.id] ? "Hide Comments ↑" : "Show Comments ↓"}
                            </Button>
                            {expandedPosts[post.id] && (
                                <div className="mt-2 max-h-64 overflow-y-auto border p-2 rounded">
                                    {post.comments?.length ? (
                                        post.comments.map((comment) => (
                                            <div key={comment.id} className="mb-2">
                                                <p>{comment.content}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No comments.</p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}

            {/* EditPost Dialog */}
            <EditPost
                post={selectedPost}
                open={editOpen}
                onClose={() => setEditOpen(false)}
            />

            {/* DeletePost Dialog */}
            <DeletePost
                post={selectedPost}
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
            />
        </div>
    );
}
