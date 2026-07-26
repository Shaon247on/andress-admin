"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/elements/card";
import { ArrowLeft, CalendarIcon, DollarSign, Building2, TrendingUp } from "lucide-react";
import OverviewTab from "./tabs/OverviewTab";
import CourtsTab from "./tabs/CourtsTab";
import BookingsTab from "./tabs/BookingsTab";
import CustomersTab from "./tabs/CustomersTab";
import TeamTab from "./tabs/TeamTab";
import PostsTab from "./tabs/PostsTab";
import type { CourtManagerDetail } from "@/types/CourtManager.type";

const tabs = [
  { id: "overview", label: "Overview", component: OverviewTab },
  { id: "courts", label: "Courts", component: CourtsTab },
  { id: "bookings", label: "Bookings", component: BookingsTab },
  { id: "customers", label: "Customers", component: CustomersTab },
  { id: "staff", label: "Staff", component: TeamTab },
  { id: "posts", label: "Posts", component: PostsTab },
];

interface CourtManagerDetailsProps {
  manager: CourtManagerDetail | null;
  errorMessage?: string;
}

export default function CourtManagerDetails({
  manager,
  errorMessage,
}: CourtManagerDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Get the active tab component - MUST be called before any early returns
  const ActiveTabComponent = useMemo(() => {
    const tab = tabs.find((t) => t.id === activeTab);
    return tab?.component;
  }, [activeTab]);

  // Early returns after all hooks
  if (errorMessage) {
    return (
      <div className="space-y-6 pb-10 max-w-6xl mx-auto">
        <Link
          href="/dashboard/court-managers"
          className="inline-flex items-center text-sm font-medium text-text hover:text-text/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Managers
        </Link>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      </div>
    );
  }

  if (!manager) {
    return (
      <div className="space-y-6 pb-10 max-w-6xl mx-auto">
        <Link
          href="/dashboard/court-managers"
          className="inline-flex items-center text-sm font-medium text-text hover:text-text/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Managers
        </Link>
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
          Manager not found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/dashboard/court-managers"
          className="inline-flex items-center text-sm font-medium text-text hover:text-text/80"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Managers
        </Link>
        <div>
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded text-sm font-medium ${
              manager.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {manager.status.charAt(0).toUpperCase() + manager.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text">
          {manager.full_name}
        </h1>
        <p className="text-sm text-text-muted mt-1">{manager.venue}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface">
          <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center text-text-muted">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-3xl font-bold text-text">{manager.cards.total_bookings}</p>
            <p className="text-sm text-text-muted mt-1">Total Bookings</p>
          </div>
        </Card>

        <Card className="flex flex-col p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface">
          <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center text-text-muted">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-3xl font-bold text-text">
              €{parseFloat(manager.cards.revenue).toLocaleString()}
            </p>
            <p className="text-sm text-text-muted mt-1">Monthly Revenue</p>
          </div>
        </Card>

        <Card className="flex flex-col p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface">
          <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center text-text-muted">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-3xl font-bold text-text">{manager.cards.number_of_courts}</p>
            <p className="text-sm text-text-muted mt-1">Number of Courts</p>
          </div>
        </Card>

        <Card className="flex flex-col p-6 gap-4 border-none shadow-sm rounded-2xl bg-surface">
          <div className="h-10 w-10 rounded-lg bg-background flex items-center justify-center text-text-muted">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-3xl font-bold text-text">{manager.cards.total_posts}</p>
            <p className="text-sm text-text-muted mt-1">Total Posts</p>
          </div>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-border overflow-x-auto">
        <nav className="flex space-x-8 min-w-max px-2" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? "border-[#10b981] text-[#10b981]"
                    : "border-transparent text-text-muted hover:text-text hover:border-border"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px] mt-6">
        {ActiveTabComponent && (
          <ActiveTabComponent managerId={manager.id} manager={manager} />
        )}
      </div>
    </div>
  );
}