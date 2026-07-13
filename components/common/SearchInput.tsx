"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/elements/input";
import { Button } from "@/components/ui/button";

export default function SearchInput({
  name = "search",
  placeholder = "Search...",
}: {
  name?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get(name) ?? "";
  const [value, setValue] = useState(initial);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams(Array.from(params.entries()));
    if (value) q.set(name, value);
    else q.delete(name);
    q.delete("page");
    router.push(`${window.location.pathname}?${q.toString()}`);
  };

  const onClear = () => {
    setValue("");
    const q = new URLSearchParams(Array.from(params.entries()));
    q.delete(name);
    q.delete("page");
    router.push(`${window.location.pathname}?${q.toString()}`);
  };

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 pl-9 pr-20 rounded-lg bg-white border-border shadow-sm"
        />
        <div className="absolute right-1 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Clear search"
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <Button type="submit" size="sm" className="h-8 px-3 text-xs font-medium rounded-md">
            Search
          </Button>
        </div>
      </div>
    </form>
  );
}