"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/elements/logo";
import {
  LayoutDashboard,
  Users,
  UserCog,
  MapPin,
  FileText,
  CalendarDays,
  MessageSquare,
  CreditCard,
  Settings,
  LogOut,
  Shield,
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Request", href: "/dashboard/requests", icon: FileText },
  { name: "AthlonGo Users", href: "/dashboard/users", icon: Users },
  { name: "Admin Users", href: "/dashboard/admin-users", icon: Shield },
  { name: "Court Manager", href: "/dashboard/court-managers", icon: UserCog },
  { name: "All Courts", href: "/dashboard/courts", icon: MapPin },
  { name: "Bookings", href: "/dashboard/bookings", icon: CalendarDays },
  { name: "Support", href: "/dashboard/support", icon: MessageSquare },
  { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
];

interface SidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isMobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block flex flex-col",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
          <Logo className="h-8 items-start !flex-row !pb-0 [&_span]:text-xl" />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-text-muted hover:bg-background hover:text-text"
                )}
              >
                <Icon
                  className={cn(
                    "mr-3 h-5 w-5 shrink-0",
                    isActive
                      ? "text-primary-foreground"
                      : "text-text-muted group-hover:text-text"
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3 space-y-1">
          <Link
            href="/dashboard/settings"
            className={cn(
              "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
              pathname === "/dashboard/settings" ||
                pathname.startsWith("/dashboard/settings/")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-text-muted hover:bg-background hover:text-text"
            )}
          >
            <Settings
              className={cn(
                "mr-3 h-5 w-5 shrink-0",
                pathname === "/dashboard/settings" ||
                  pathname.startsWith("/dashboard/settings/")
                  ? "text-primary-foreground"
                  : "text-text-muted group-hover:text-text"
              )}
            />
            Settings
          </Link>
          <Link
            href="/login"
            className="group flex items-center px-3 py-2.5 text-sm font-medium text-text-muted rounded-md hover:bg-background hover:text-text transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5 shrink-0 text-text-muted group-hover:text-text" />
            Log Out
          </Link>
        </div>
      </aside>
    </>
  );
}