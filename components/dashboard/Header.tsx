"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search, Menu, ChevronDown, Settings, LogOut } from "lucide-react";
import { Input } from "@/components/elements/input";

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

export default function Header({ onMobileMenuOpen }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-4 sm:px-6 lg:px-8">
      <div className="flex flex-1 items-center gap-4">
        <button
          onClick={onMobileMenuOpen}
          className="p-2 text-text-muted lg:hidden hover:bg-background rounded-md"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="w-full max-w-lg relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          <Input
            type="search"
            placeholder="Search users, courts, bookings, matches..."
            className="pl-10 w-full bg-background border-border h-10 rounded-lg shadow-sm"
          />
        </div>
      </div>

      <div className="ml-4 flex items-center gap-4 relative">
        <div
          className="flex items-center gap-3 cursor-pointer bg-background px-3 py-1.5 rounded-full border border-border transition-colors hover:bg-surface"
          onClick={() => setIsProfileOpen((prev) => !prev)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-text leading-none">Admin User</p>
            <p className="text-xs text-text-muted mt-1 leading-none">Admin Portal</p>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-text-muted transition-transform duration-200",
              isProfileOpen && "rotate-180"
            )}
          />
        </div>

        {isProfileOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsProfileOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border bg-surface shadow-lg z-50 overflow-hidden">
              <div className="p-2 space-y-1">
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[15px] font-medium text-text hover:bg-background transition-colors"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Settings className="h-5 w-5 text-text" />
                  Settings
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-[15px] font-medium text-red-500 hover:bg-red-50 transition-colors"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <LogOut className="h-5 w-5 text-red-500" />
                  Logout
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}