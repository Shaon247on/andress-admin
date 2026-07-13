// components/common/SelectFilter.tsx

"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  label: string;
  value: string;
}

export default function SelectFilter({
  name = "filter",
  placeholder = "All",
  options = [],
  className
}: {
  name?: string;
  placeholder?: string;
  className?: string;
  options?: SelectOption[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get(name) ?? "all";

  const onChange = (value: string) => {
    const q = new URLSearchParams(Array.from(searchParams.entries()));
    if (value && value !== "all") {
      q.set(name, value);
    } else {
      q.delete(name);
    }
    q.delete("page");
    router.push(`${window.location.pathname}?${q.toString()}`);
  };

  // Filter out any options with empty string values
  const validOptions = options.filter(opt => opt.value !== "");
  
  // Add "All" option at the beginning
  const allOptions = [{ label: placeholder, value: "all" }, ...validOptions];

  return (
    <Select value={current} onValueChange={onChange}>
      <SelectTrigger className={`h-10 w-full min-w-[140px] rounded-lg border border-border bg-background px-3 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ${className}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-surface border-border rounded-xl shadow-lg">
        {allOptions.map((opt) => (
          <SelectItem 
            key={opt.value} 
            value={opt.value}
            className="cursor-pointer hover:bg-background transition-colors"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}