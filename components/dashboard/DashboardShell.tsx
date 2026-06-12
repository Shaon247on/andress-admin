"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        isMobileOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMobileMenuOpen={() => setIsMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}