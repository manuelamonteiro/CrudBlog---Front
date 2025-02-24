"use client";

import { useState } from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import CommentsSection from "./components/comment";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Comment {
  id: number;
  content: string;
  post_id: number;
  user_id: number;
  user?: User;
}

interface Post {
  id: number;
  title: string;
  content: string;
  user: User;
  comments: Comment[];
}

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "An error occurred.");
  }
  return res.json();
};

export default function PostsPage() {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  
  const {
    data: posts,
    error,
    isLoading,
    mutate,
  } = useSWR<Post[]>(`${baseUrl}/posts`, fetcher);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>({});

  if (error) {
    toast.error(error.message || "Error fetching posts.");
  }

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
      <div className="flex justify-end items-center gap-4 mb-4">
        <Button variant="outline" onClick={() => router.push("/login")}>
          Login
        </Button>
        <CreatePost mutate={mutate} />
      </div>

      {isLoading ? (
        <div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-44 bg-gray-200 rounded animate-pulse mb-6"></div>
          ))}
        </div>
      ) : !posts || posts.length === 0 ? (
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
              <p className="pl-1">{post.content}</p>
              <Button
                variant="ghost"
                onClick={() => toggleExpand(post.id)}
                className="mt-2 pl-1"
              >
                {expandedPosts[post.id] ? "Hide Comments ↑" : "Show Comments ↓"}
              </Button>
              {expandedPosts[post.id] && (
                <CommentsSection 
                postId={post.id} comments={post.comments} 
                mutate={mutate}
                />
              )}
            </CardContent>
          </Card>
        ))
      )}

      <EditPost
        post={selectedPost}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mutate={mutate}
      />

      <DeletePost
        post={selectedPost}
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        mutate={mutate}
      />
    </div>
  );
}
