"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/elements/card";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/common/Pagination";
import { Loader2, Megaphone, Wrench, MoreVertical, Ban, Eye, EyeOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/elements/dialog";
import { getPostsTabAction, suspendPostAction, unsuspendPostAction } from "@/actions/court-manager.action";
import type { PostItem, PaginationInfo } from "@/types/CourtManager.type";
import { toast } from "sonner";

interface PostsTabProps {
  managerId: string;
}

export default function PostsTab({ managerId }: PostsTabProps) {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pagination, setPagination] = useState<PaginationInfo>({
    count: 0,
    page: 1,
    page_size: 20,
    total_pages: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"suspend" | "unsuspend" | null>(null);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const res = await getPostsTabAction(managerId, currentPage);
      if (res.success) {
        setPosts(res.data.posts);
        setTotal(res.data.total_posts);
        setPagination(res.data.pagination);
      } else {
        toast.error(res.message);
      }
      setLoading(false);
    };

    loadData();
  }, [managerId, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleActionClick = (post: PostItem, type: "suspend" | "unsuspend") => {
    setSelectedPost(post);
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedPost) return;

    setActionLoading(true);
    const action = dialogType === "suspend" 
      ? suspendPostAction(selectedPost.id) 
      : unsuspendPostAction(selectedPost.id);

    const res = await action;
    
    if (res.success) {
      toast.success(res.message);
      // Refresh the posts list
      const refreshRes = await getPostsTabAction(managerId, currentPage);
      if (refreshRes.success) {
        setPosts(refreshRes.data.posts);
        setTotal(refreshRes.data.total_posts);
        setPagination(refreshRes.data.pagination);
      }
    } else {
      toast.error(res.message);
    }
    
    setActionLoading(false);
    setDialogOpen(false);
    setSelectedPost(null);
    setDialogType(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 max-w-4xl">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-text">All Posts</h3>
          <span className="text-sm text-text-muted">{total} posts</span>
        </div>
        {posts.length === 0 ? (
          <Card className="p-6 border border-border shadow-sm rounded-2xl bg-surface text-center text-text-muted">
            No posts found.
          </Card>
        ) : (
          <>
            {posts.map((post) => (
              <Card
                key={post.id}
                className={`p-6 border shadow-sm rounded-2xl bg-surface ${
                  post.is_suspended ? "border-red-200 bg-red-50/30" : "border-border"
                }`}
              >
                <div className="flex gap-4">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${
                      post.category === "announcement"
                        ? "bg-[#3b82f6]"
                        : post.category === "maintenance"
                        ? "bg-[#64748b]"
                        : "bg-[#8b5cf6]"
                    }`}
                  >
                    {post.category === "announcement" ? (
                      <Megaphone className="h-6 w-6 text-white" />
                    ) : post.category === "maintenance" ? (
                      <Wrench className="h-6 w-6 text-white" />
                    ) : (
                      <Megaphone className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-base font-bold text-text">{post.title}</h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${
                              post.category === "announcement"
                                ? "bg-blue-50 text-blue-600"
                                : post.category === "maintenance"
                                ? "bg-slate-100 text-slate-600"
                                : "bg-purple-50 text-purple-600"
                            }`}
                          >
                            {post.category.toUpperCase()}
                          </span>
                          {post.court && (
                            <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold tracking-wide">
                              {post.court}
                            </span>
                          )}
                          {post.is_suspended && (
                            <span className="inline-flex px-2 py-0.5 rounded bg-red-100 text-red-600 text-[10px] font-bold tracking-wide">
                              Suspended
                            </span>
                          )}
                          <span className="text-xs text-text-muted font-medium">
                            {new Date(post.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-text-muted hover:text-text shrink-0"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end" 
                          className="w-48 rounded-xl border-border bg-surface shadow-lg"
                        >
                          {post.is_suspended ? (
                            <DropdownMenuItem
                              onClick={() => handleActionClick(post, "unsuspend")}
                              className="flex items-center gap-2 cursor-pointer text-green-600 hover:text-green-700"
                            >
                              <Eye className="h-4 w-4" />
                              <span>Unban Post</span>
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleActionClick(post, "suspend")}
                              className="flex items-center gap-2 cursor-pointer text-red-600 hover:text-red-700"
                            >
                              <Ban className="h-4 w-4" />
                              <span>Ban Post</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className={`text-sm ${post.is_suspended ? "text-red-500" : "text-text-muted"} leading-relaxed`}>
                      {post.content}
                    </p>
                    {post.likes > 0 && (
                      <div className="flex items-center gap-1.5 text-sm text-text-muted mt-2">
                        <Megaphone className="w-4 h-4" />
                        <span>{post.likes} likes</span>
                      </div>
                    )}
                    {post.is_suspended && (
                      <div className="flex items-center gap-1.5 text-sm text-red-600 mt-2">
                        <EyeOff className="w-4 h-4" />
                        <span>This post is suspended and hidden from users</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            {pagination.total_pages > 1 && (
              <div className="pt-4">
                <Pagination total={pagination.count} pageSize={pagination.page_size} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === "suspend" ? "Ban Post" : "Unban Post"}
            </DialogTitle>
            <DialogDescription>
              {dialogType === "suspend" 
                ? `Are you sure you want to ban this post? It will no longer appear on the user feed.`
                : `Are you sure you want to unban this post? It will appear on the user feed again.`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedPost && (
              <div className="bg-background p-4 rounded-xl border border-border">
                <p className="text-sm font-medium text-text">{selectedPost.title}</p>
                <p className="text-sm text-text-muted mt-1">{selectedPost.content}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="border-border"
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              className={dialogType === "suspend" 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : "bg-green-600 hover:bg-green-700 text-white"
              }
              onClick={handleConfirmAction}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {dialogType === "suspend" ? "Ban Post" : "Unban Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}