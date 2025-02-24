"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

import CreateComment from "../create-comment";
import EditComment from "../edit-comment";
import DeleteComment from "../delete-comment";
import { MessageSquarePlus } from "lucide-react";

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

interface CommentsSectionProps {
  postId: number;
  comments: Comment[];
  mutate: () => void;
}

export default function CommentsSection({
  postId,
  comments,
  mutate,
}: CommentsSectionProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  const handleEditClick = (comment: Comment) => {
    setSelectedComment(comment);
    setEditOpen(true);
  };

  const handleDeleteClick = (comment: Comment) => {
    setSelectedComment(comment);
    setDeleteOpen(true);
  };

  return (
    <div className="mt-2">
      <ScrollArea className="max-h-64 border p-2 rounded overflow-y-auto">
        <div className="mb-4 flex justify-end">
          <Button variant="ghost" onClick={() => setCreateOpen(true)}>
            <MessageSquarePlus />
          </Button>
        </div>
        
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={comment.id}>
              <div className="flex items-start justify-between py-2">
                <p className="text-sm">
                  <span className="font-semibold">
                    {comment.user ? comment.user.name : "User"}
                  </span>
                  : {comment.content}
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      ⋮
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onSelect={() => handleEditClick(comment)}
                      className="cursor-pointer"
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => handleDeleteClick(comment)}
                      className="cursor-pointer"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {index < comments.length - 1 && <Separator className="my-2" />}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No comments yet.</p>
        )}
      </ScrollArea>

      <CreateComment
        postId={postId}
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        mutate={mutate}
      />

      <EditComment
        comment={selectedComment}
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelectedComment(null);
        }}
        mutate={mutate}
      />

      <DeleteComment
        comment={selectedComment}
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedComment(null);
        }}
        mutate={mutate}
      />
    </div>
  );
}
