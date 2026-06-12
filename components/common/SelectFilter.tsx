"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
}

export default function SelectFilter({
  name = "filter",
  placeholder = "All",
  options = [],
}: {
  name?: string;
  placeholder?: string;
  options?: SelectOption[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get(name) ?? "";

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const q = new URLSearchParams(Array.from(params.entries()));
    if (val) q.set(name, val);
    else q.delete(name);
    q.delete("page");
    router.push(`${window.location.pathname}?${q.toString()}`);
  };

  return (
    <div className="relative inline-flex items-center">
      <select
        value={current}
        onChange={onChange}
        aria-label={placeholder}
        className="h-10 w-full min-w-[140px] appearance-none rounded-lg border border-border bg-background pl-3 pr-9 text-sm text-foreground shadow-sm outline-none transition focus:ring-2 focus:ring-primary/30 focus:border-primary cursor-pointer"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 h-4 w-4 text-muted-foreground" />
    </div>
  );
}