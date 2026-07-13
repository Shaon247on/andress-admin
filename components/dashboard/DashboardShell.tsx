"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Permissions } from "@/types/Permissions.type";

interface DashboardShellProps {
  children: React.ReactNode;
  permissions: Permissions | null;
}

export default function DashboardClientLayout({
  children,
  permissions,
}: DashboardShellProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        permissions={permissions}
        isMobileOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        <Header onMobileMenuOpen={() => setIsMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
