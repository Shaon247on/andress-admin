"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../elements/button";
import { cn } from "@/lib/utils";

export default function Pagination({
  total = 0,
  pageSize = 10,
}: {
  total?: number;
  pageSize?: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const current = parseInt(params.get("page") || "1", 10) || 1;
  const pages = Math.max(1, Math.ceil((total || 0) / pageSize));

  const goto = (p: number) => {
    const q = new URLSearchParams(Array.from(params.entries()));
    if (p > 1) q.set("page", String(p));
    else q.delete("page");
    router.push(`${window.location.pathname}?${q.toString()}`);
  };

  const getPageNumbers = (): (number | "ellipsis")[] => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
    const items: (number | "ellipsis")[] = [1];
    if (current > 3) items.push("ellipsis");
    const start = Math.max(2, current - 1);
    const end = Math.min(pages - 1, current + 1);
    for (let i = start; i <= end; i++) items.push(i);
    if (current < pages - 2) items.push("ellipsis");
    items.push(pages);
    return items;
  };

  return (
    <div className="flex items-center justify-between gap-4 mt-4 flex-wrap">
      {/* Result count */}
      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{current}</span> of{" "}
        <span className="font-medium text-foreground">{pages}</span>
        {total > 0 && (
          <>
            {" · "}
            <span className="font-medium text-foreground">{total}</span> results
          </>
        )}
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => goto(Math.max(1, current - 1))}
          disabled={current <= 1}
          className="h-9 gap-1 px-3 text-sm font-medium"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Prev</span>
        </Button>

        {/* Page numbers */}
        <div className="flex items-center gap-1 mx-1">
          {getPageNumbers().map((page, idx) =>
            page === "ellipsis" ? (
              <span
                key={`ellipsis-${idx}`}
                className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground select-none"
              >
                &hellip;
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goto(page)}
                aria-label={`Page ${page}`}
                aria-current={page === current ? "page" : undefined}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors",
                  page === current
                    ? "bg-primary text-primary-foreground shadow-sm pointer-events-none"
                    : "border border-border bg-background text-foreground hover:bg-muted"
                )}
              >
                {page}
              </button>
            )
          )}
        </div>

        {/* Next */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => goto(Math.min(pages, current + 1))}
          disabled={current >= pages}
          className="h-9 gap-1 px-3 text-sm font-medium"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}