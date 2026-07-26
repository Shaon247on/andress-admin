// app/dashboard/users/[id]/UserDetails.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/elements/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Trophy,
  MessageSquare,
  AlertOctagon,
  Star,
  Flag,
  UserCheck,
} from "lucide-react";
import UserActionDialog from "../UserActionDialog";
import type { UserDetail } from "@/types/User.type";
import Image from "next/image";

const StatusBadge = ({ status }: { status: string }) => {
  const isActive = status === "active";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
        isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

interface UserDetailsProps {
  user: UserDetail | null;
  errorMessage?: string;
}

export default function UserDetails({ user, errorMessage }: UserDetailsProps) {
  const router = useRouter();
  const [actionType, setActionType] = useState<"suspend" | "activate" | null>(
    null,
  );
  const [actionUser, setActionUser] = useState<any>(null);

  if (errorMessage) {
    return (
      <div className="space-y-6 pb-10 max-w-5xl mx-auto">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="space-y-6 pb-10 max-w-5xl mx-auto">
        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
          User not found
        </div>
      </div>
    );
  }

  const handleAction = (type: "suspend" | "activate") => {
    setActionType(type);
    setActionUser(user);
  };

  const handleActionComplete = () => {
    setActionType(null);
    setActionUser(null);
    // Refresh the page to get updated user data
    router.refresh();
  };

  // Safely get stats with fallback
  const stats = user?.player_card?.stats || {
    pace: 0,
    shooting: 0,
    passing: 0,
    dribbling: 0,
    defending: 0,
    physical: 0,
  };

  return (
    <div className="space-y-6 pb-10 max-w-6xl mx-auto">
      {/* Main Profile Header */}
      <Card className="border-none shadow-sm rounded-3xl bg-surface p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="h-32 w-32 rounded-full bg-primary/10 border-4 border-[#10b981] flex items-center justify-center text-primary font-bold text-4xl shrink-0 overflow-hidden relative">
          {user.photo_url === "" ? (<span className="text-emerald-600">
              {user.full_name?.charAt(0) || user.email?.charAt(0)}
            </span>):(
              <Image
              alt="User Photo"
              src={user.photo_url}
              width={150}
              height={150}
              className="w-full h-full object-center rounded-full object-cover"
              />
            )}
            
          </div>
          <div className="flex-1 text-center md:text-left w-full">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-3">
              <div>
                <h1 className="text-3xl font-extrabold text-text tracking-tight">
                  {user.full_name}
                </h1>
                <p className="text-text-muted font-medium">
                  @{user.username || "No User Name"}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {user.status === "active" ? (
                  <Button
                    variant="outline"
                    className="rounded-xl border-border h-10 px-4 font-bold shadow-sm hover:bg-background"
                    onClick={() => handleAction("suspend")}
                  >
                    <AlertOctagon className="w-4 h-4 mr-2 text-red-500" />{" "}
                    Suspend
                  </Button>
                ) : (
                  <Button
                    className="rounded-xl bg-[#10b981] hover:bg-[#059669] text-white h-10 px-4 font-bold shadow-sm"
                    onClick={() => handleAction("activate")}
                  >
                    <UserCheck className="w-4 h-4 mr-2" /> Activate
                  </Button>
                )}
                {/* <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-10 px-5 font-bold shadow-sm">
                  <MessageSquare className="w-4 h-4 mr-2" /> Send Message
                </Button> */}
              </div>
            </div>

            <p className="text-text text-sm max-w-lg mx-auto md:mx-0 mb-8 flex items-center justify-center md:justify-start gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-xs">
                ⚽️
              </span>
              {user.bio || "No bio available"}
            </p>

            <div className="flex items-center justify-center md:justify-start gap-8">
              <div className="text-center">
                <p className="text-2xl font-black text-text">
                  {user.counts?.posts || 0}
                </p>
                <p className="text-xs text-text-muted uppercase tracking-widest font-bold mt-1">
                  Posts
                </p>
              </div>
              <div className="h-10 w-px bg-border"></div>
              <div className="text-center">
                <p className="text-2xl font-black text-text">
                  {user.counts?.followers || 0}
                </p>
                <p className="text-xs text-text-muted uppercase tracking-widest font-bold mt-1">
                  Followers
                </p>
              </div>
              <div className="h-10 w-px bg-border"></div>
              <div className="text-center">
                <p className="text-2xl font-black text-text">
                  {user.counts?.following || 0}
                </p>
                <p className="text-xs text-text-muted uppercase tracking-widest font-bold mt-1">
                  Following
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Player Card Section */}
        <Card className="md:col-span-1 border-none shadow-sm rounded-3xl overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 p-6 text-white relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-5 -mb-5 pointer-events-none"></div>

          <h3 className="text-xs font-black uppercase tracking-widest text-orange-100 mb-6 relative z-10">
            Player Card
          </h3>

          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="relative w-32 h-40 p-2 bg-orange-300/30 rounded-2xl border border-orange-200/50 flex items-center justify-center backdrop-blur-sm mb-5 shadow-xl">
              <div className="absolute top-3 left-3 text-2xl font-black drop-shadow-md z-30">
                {user.player_card?.overall_rating || 0}
              </div>
              {user.avatar_url === "" ? (
                <div className="text-5xl opacity-80">👤</div>
              ) : (
                <Image
                  src={user.avatar_url}
                  alt={user.photo_url || "User Avatar"}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover object-center relative z-10"
                />
              )}
              {/* <div className="text-5xl opacity-80">👤</div> */}
            </div>
            <div className="flex items-center gap-2 bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
              <span className="text-lg">🇧🇷</span>
              <span className="text-sm font-bold tracking-wide">
                {user.player_card?.country || "N/A"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 relative z-10">
            {Object.entries(stats).map(([key, value]) => (
              <div
                key={key}
                className="bg-white/10 rounded-xl px-3 py-2 flex items-center gap-2 backdrop-blur-sm border border-white/20"
              >
                <span className="text-orange-200 font-black text-sm w-5">
                  {value}
                </span>
                <span className="text-xs font-bold text-white tracking-wide capitalize">
                  {key}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Match Summary & History */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl bg-surface p-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted mb-6">
              Match Summary
            </h3>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center">
                <p className="text-3xl font-black text-text mb-2">
                  {user.match_summary?.matches || 0}
                </p>
                <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
                  Matches
                </p>
              </div>
              <div className="bg-[#e2f5ec] border border-[#a7f3d0] rounded-2xl p-5 text-center">
                <p className="text-3xl font-black text-emerald-600 mb-2">
                  {user.match_summary?.win || 0}
                </p>
                <p className="text-[10px] text-emerald-600/70 uppercase tracking-widest font-bold">
                  Win
                </p>
              </div>
              <div className="bg-[#f3e8ff] border border-[#e9d5ff] rounded-2xl p-5 text-center">
                <p className="text-3xl font-black text-purple-600 mb-2">
                  {user.match_summary?.lose || 0}
                </p>
                <p className="text-[10px] text-purple-600/70 uppercase tracking-widest font-bold">
                  Lose
                </p>
              </div>
              {/* <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-5 text-center">
                <p className="text-3xl font-black text-yellow-600 mb-2">
                  {user.match_summary?.mvp || 0}
                </p>
                <p className="text-[10px] text-yellow-600/70 uppercase tracking-widest font-bold">
                  MVP
                </p>
              </div> */}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-extrabold">
                <span className="text-text">Win Rate</span>
                <span className="text-emerald-500">
                  {user.match_summary?.win_rate || 0}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${user.match_summary?.win_rate || 0}%` }}
                ></div>
                <div
                  className="h-full bg-slate-800 rounded-full"
                  style={{
                    width: `${100 - (user.match_summary?.win_rate || 0)}%`,
                  }}
                ></div>
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl bg-surface overflow-hidden">
            <div className="p-6 border-b border-border bg-background/30">
              <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">
                Recent Matches
              </h3>
            </div>
            <div className="divide-y divide-border">
              {!user.recent_matches || user.recent_matches.length === 0 ? (
                <div className="p-6 text-center text-text-muted">
                  No recent matches
                </div>
              ) : (
                user.recent_matches.map((match) => (
                  <div
                    key={match.id}
                    className="p-6 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-xs font-bold text-text-muted">
                        {new Date(match.played_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      {match.result === "win" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black tracking-widest">
                          <Trophy className="w-3.5 h-3.5 mr-1.5" /> WIN
                        </span>
                      ) : match.result === "lose" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black tracking-widest">
                          LOSE
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-black tracking-widest">
                          DRAW
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center flex-1">
                        <p className="font-bold text-text text-lg">
                          {match.team_a_name}
                        </p>
                      </div>
                      <div className="bg-background px-5 py-2.5 rounded-2xl text-2xl font-black tracking-widest border border-border shadow-sm">
                        {match.score_a} - {match.score_b}
                      </div>
                      <div className="text-center flex-1">
                        <p className="font-bold text-text text-lg">
                          {match.team_b_name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Feedback & Reports Section */}
      <Card className="border-none shadow-sm rounded-3xl bg-surface overflow-hidden mt-6">
        <div className="p-6 border-b border-border bg-background/30 flex justify-between items-center">
          <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">
            Player Feedback & Reports
          </h3>
          {user.reports &&
            user.reports.filter((r) => r.status === "pending").length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider">
                {user.reports.filter((r) => r.status === "pending").length}{" "}
                Active Report
                {user.reports.filter((r) => r.status === "pending").length > 1
                  ? "s"
                  : ""}
              </span>
            )}
        </div>
        <div className="divide-y divide-border">
          {!user.reports || user.reports.length === 0 ? (
            <div className="p-6 text-center text-text-muted">
              No reports or feedback
            </div>
          ) : (
            user.reports.map((report) => (
              <div
                key={report.id}
                className={`p-6 ${report.status === "pending" ? "bg-red-50/30 hover:bg-red-50/50" : "hover:bg-slate-50"} transition-colors flex gap-5`}
              >
                <div className="mt-1">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center border ${
                      report.status === "pending"
                        ? "bg-red-100 text-red-600 border-red-200"
                        : "bg-amber-100 text-amber-600 border-amber-200"
                    }`}
                  >
                    <Flag className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <h4 className="font-bold text-text text-base flex items-center gap-3">
                        Reported for: {report.reason}
                        {report.status === "pending" && (
                          <span className="px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider">
                            Pending Review
                          </span>
                        )}
                        {report.status === "reviewed" && (
                          <span className="px-2.5 py-1 rounded-md bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider">
                            Reviewed
                          </span>
                        )}
                        {report.status === "resolved" && (
                          <span className="px-2.5 py-1 rounded-md bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-wider">
                            Resolved
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-text-muted font-medium mt-1">
                        Reported by {report.reported_by} •{" "}
                        {new Date(report.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-text mt-3 font-medium bg-background/50 p-4 rounded-xl border border-border">
                    &quot;{report.description}&quot;
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Action Dialog */}
      <UserActionDialog
        open={actionType !== null}
        onOpenChange={() => setActionType(null)}
        type={actionType || "suspend"}
        user={actionUser}
        onComplete={handleActionComplete}
      />
    </div>
  );
}
