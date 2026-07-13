// components/layout/Header.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, ChevronDown, Settings, LogOut } from "lucide-react";
import { useUser } from "@/context/UserContext";
import Image from "next/image";

interface HeaderProps {
  onMobileMenuOpen: () => void;
}

export default function Header({ onMobileMenuOpen }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, loading } = useUser();

  const getRoleDisplay = (role?: string) => {
    switch (role) {
      case "owner":
        return "Admin Portal";
      case "super_admin":
        return "Admin Portal";
      case "moderator":
        return "Moderator Portal";
      case "support":
        return "Support Portal";
      default:
        return "Portal";
    }
  };

  const getInitials = () => {
    if (user?.full_name) {
      return user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "A";
  };

  const getDisplayName = () => {
    if (user?.full_name) {
      return user.full_name;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "Admin User";
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "owner":
      case "super_admin":
        return "text-green-600";
      case "moderator":
        return "text-blue-600";
      case "support":
        return "text-purple-600";
      default:
        return "text-green-600";
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface px-4 sm:px-6 lg:px-8">
      <div className="flex flex-1 items-center gap-4">
        <button
          onClick={onMobileMenuOpen}
          className="p-2 text-text-muted lg:hidden hover:bg-background rounded-md"
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className={`text-lg font-semibold ${getRoleColor(user?.role)} font-stretch-110%`}>
          {loading ? "Loading..." : `${getRoleDisplay(user?.role)}`}
        </div>
      </div>

      <div className="ml-4 flex items-center gap-4 relative">
        <div
          className="flex items-center gap-3 cursor-pointer bg-background px-3 py-1.5 rounded-full border border-border transition-colors hover:bg-surface"
          onClick={() => setIsProfileOpen((prev) => !prev)}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold overflow-hidden">
            {user?.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={getDisplayName()}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials()
            )}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-text leading-none">
              {getDisplayName()}
            </p>
            <p className="text-xs text-text-muted mt-1 leading-none capitalize">
              {user?.role?.replace("_", " ") || "User"}
            </p>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-text-muted transition-transform duration-200",
              isProfileOpen && "rotate-180",
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