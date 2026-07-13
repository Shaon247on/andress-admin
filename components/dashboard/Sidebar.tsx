// components/layout/Sidebar.tsx

"use client";

import React from "react";
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
import type { Permissions, SidebarItem } from "@/types/Permissions.type";

// Define sidebar items with permission keys
const sidebarItems: SidebarItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    permissionKey: "dashboard",
  },
  {
    name: "Request",
    href: "/dashboard/requests",
    icon: FileText,
    permissionKey: "requests",
  },
  {
    name: "AthlonGo Users",
    href: "/dashboard/users",
    icon: Users,
    permissionKey: "athlongo_users",
  },
  {
    name: "Admin Users",
    href: "/dashboard/admin-users",
    icon: Shield,
    permissionKey: "admin_users",
  },
  {
    name: "Court Manager",
    href: "/dashboard/court-managers",
    icon: UserCog,
    permissionKey: "court_manager",
  },
  {
    name: "All Courts",
    href: "/dashboard/courts",
    icon: MapPin,
    permissionKey: "all_courts",
  },
  {
    name: "Bookings",
    href: "/dashboard/bookings",
    icon: CalendarDays,
    permissionKey: "bookings",
  },
  {
    name: "Support",
    href: "/dashboard/support",
    icon: MessageSquare,
    permissionKey: "support",
  },
  {
    name: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
    permissionKey: "payments",
  },
];

interface SidebarProps {
  isMobileOpen: boolean;
  onClose: () => void;
  permissions: Permissions | null;
}

export default function Sidebar({
  isMobileOpen,
  onClose,
  permissions,
}: SidebarProps) {
  const pathname = usePathname();

  // Filter sidebar items based on permissions
  const filteredItems = sidebarItems.filter((item) => {
    // If no permission key, show item
    if (!item.permissionKey) return true;
    // Check if user has permission for this item
    return permissions?.[item.permissionKey] ?? false;
  });

  // Check if dashboard is accessible
  const hasDashboardAccess = permissions?.dashboard ?? false;

  // Function to check if a route is active
  const isRouteActive = (item: SidebarItem) => {
    if (item.href === "/dashboard") {
      // Dashboard should only be active when exactly on /dashboard
      return pathname === "/dashboard";
    }
    // For other routes, check if the pathname starts with the href
    return pathname === item.href || pathname.startsWith(item.href + "/");
  };

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
          "fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 flex flex-col",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
          <Logo className="h-8 items-start !flex-row !pb-0 [&_span]:text-xl" />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-text-muted text-sm">
              No accessible pages
            </div>
          ) : (
            filteredItems.map((item) => {
              const isActive = isRouteActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-text-muted hover:bg-background hover:text-text",
                  )}
                >
                  <Icon
                    className={cn(
                      "mr-3 h-5 w-5 shrink-0",
                      isActive
                        ? "text-primary-foreground"
                        : "text-text-muted group-hover:text-text",
                    )}
                  />
                  {item.name}
                </Link>
              );
            })
          )}
        </nav>

        <div className="border-t border-border p-3 space-y-1">
          <Link
            href="/dashboard/settings"
            onClick={onClose}
            className={cn(
              "group flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
              pathname === "/dashboard/settings" ||
                pathname.startsWith("/dashboard/settings/")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-text-muted hover:bg-background hover:text-text",
            )}
          >
            <Settings
              className={cn(
                "mr-3 h-5 w-5 shrink-0",
                pathname === "/dashboard/settings" ||
                  pathname.startsWith("/dashboard/settings/")
                  ? "text-primary-foreground"
                  : "text-text-muted group-hover:text-text",
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
