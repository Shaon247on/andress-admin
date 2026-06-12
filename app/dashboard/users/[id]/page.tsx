"use client";

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/elements/card';
import { Button } from '@/components/elements/button';
import { ArrowLeft, Trophy, MessageSquare, AlertOctagon, Star, Flag } from 'lucide-react';

const matchHistory = [
  { id: 1, teamA: 'Street Kings', teamB: 'Blue Eagles', scoreA: 4, scoreB: 2, result: 'WIN', date: '5h ago' },
  { id: 2, teamA: 'Street Kings', teamB: 'Neon FC', scoreA: 1, scoreB: 3, result: 'LOSE', date: '1d ago' },
];

export default function UserDetailsPage() {
  const user = {
    name: 'Marcus Wright',
    handle: '@jt_goal',
    bio: 'Right foot attacker. Competitive player. Love 5v5 at night.',
    stats: { posts: 12, followers: 128, following: 84 },
    sport: 'Football',
    matchesPlayed: 87,
    playerCard: {
      ovr: 88,
      country: 'Brazil',
      attributes: [
        { name: 'Pace', value: 85 },
        { name: 'Shooting', value: 82 },
        { name: 'Passing', value: 78 },
        { name: 'Dribbling', value: 88 },
        { name: 'Defending', value: 45 },
        { name: 'Physical', value: 76 }
      ]
    },
    matchSummary: {
      matches: 87,
      win: 54,
      lose: 23,
      mvp: 12,
      winRate: 50
    }
  };

  return (
    <div className="space-y-6 pb-10 max-w-5xl mx-auto">
      <Link href="/dashboard/users" className="inline-flex items-center text-sm font-medium text-text hover:text-text/80 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Users
      </Link>

      {/* Main Profile Header */}
      <Card className="border-none shadow-sm rounded-3xl bg-surface p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="h-32 w-32 rounded-full bg-primary/10 border-4 border-[#10b981] flex items-center justify-center text-primary font-bold text-4xl shrink-0 overflow-hidden relative">
            <span className="text-emerald-600">MW</span>
          </div>
          <div className="flex-1 text-center md:text-left w-full">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-3">
              <div>
                <h1 className="text-3xl font-extrabold text-text tracking-tight">{user.name}</h1>
                <p className="text-text-muted font-medium">{user.handle}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant="outline" className="rounded-xl border-border h-10 px-4 font-bold shadow-sm hover:bg-background">
                  <AlertOctagon className="w-4 h-4 mr-2 text-red-500" /> Suspend
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-10 px-5 font-bold shadow-sm">
                  <MessageSquare className="w-4 h-4 mr-2" /> Send Message
                </Button>
              </div>
            </div>

            <p className="text-text text-sm max-w-lg mx-auto md:mx-0 mb-8 flex items-center justify-center md:justify-start gap-2">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-xs">⚽️</span>
              {user.bio}
            </p>

            <div className="flex items-center justify-center md:justify-start gap-8">
              <div className="text-center">
                <p className="text-2xl font-black text-text">{user.stats.posts}</p>
                <p className="text-xs text-text-muted uppercase tracking-widest font-bold mt-1">Posts</p>
              </div>
              <div className="h-10 w-px bg-border"></div>
              <div className="text-center">
                <p className="text-2xl font-black text-text">{user.stats.followers}</p>
                <p className="text-xs text-text-muted uppercase tracking-widest font-bold mt-1">Followers</p>
              </div>
              <div className="h-10 w-px bg-border"></div>
              <div className="text-center">
                <p className="text-2xl font-black text-text">{user.stats.following}</p>
                <p className="text-xs text-text-muted uppercase tracking-widest font-bold mt-1">Following</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Player Card Section */}
        <Card className="md:col-span-1 border-none shadow-sm rounded-3xl overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 p-6 text-white relative">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl -ml-5 -mb-5 pointer-events-none"></div>

          <h3 className="text-xs font-black uppercase tracking-widest text-orange-100 mb-6 relative z-10">Player Card</h3>

          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="relative w-32 h-40 bg-orange-300/30 rounded-2xl border border-orange-200/50 flex items-center justify-center backdrop-blur-sm mb-5 shadow-xl">
              <div className="absolute top-3 left-3 text-2xl font-black drop-shadow-md">{user.playerCard.ovr}</div>
              <div className="text-5xl opacity-80">👤</div>
            </div>
            <div className="flex items-center gap-2 bg-black/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
              <span className="text-lg">🇧🇷</span>
              <span className="text-sm font-bold tracking-wide">{user.playerCard.country}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 relative z-10">
            {user.playerCard.attributes.map((attr, idx) => (
              <div key={idx} className="bg-white/10 rounded-xl px-3 py-2 flex items-center gap-2 backdrop-blur-sm border border-white/20">
                <span className="text-orange-200 font-black text-sm w-5">{attr.value}</span>
                <span className="text-xs font-bold text-white tracking-wide">{attr.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Match Summary & History */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-none shadow-sm rounded-3xl bg-surface p-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted mb-6">Match Summary</h3>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center">
                <p className="text-3xl font-black text-text mb-2">{user.matchSummary.matches}</p>
                <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Matches</p>
              </div>
              <div className="bg-[#e2f5ec] border border-[#a7f3d0] rounded-2xl p-5 text-center">
                <p className="text-3xl font-black text-emerald-600 mb-2">{user.matchSummary.win}</p>
                <p className="text-[10px] text-emerald-600/70 uppercase tracking-widest font-bold">Win</p>
              </div>
              <div className="bg-[#f3e8ff] border border-[#e9d5ff] rounded-2xl p-5 text-center">
                <p className="text-3xl font-black text-purple-600 mb-2">{user.matchSummary.lose}</p>
                <p className="text-[10px] text-purple-600/70 uppercase tracking-widest font-bold">Lose</p>
              </div>
              <div className="bg-[#fffbeb] border border-[#fde68a] rounded-2xl p-5 text-center">
                <p className="text-3xl font-black text-yellow-600 mb-2">{user.matchSummary.mvp}</p>
                <p className="text-[10px] text-yellow-600/70 uppercase tracking-widest font-bold">MVP</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm font-extrabold">
                <span className="text-text">Win Rate</span>
                <span className="text-emerald-500">{user.matchSummary.winRate}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${user.matchSummary.winRate}%` }}></div>
                <div className="h-full bg-slate-800 rounded-full" style={{ width: `${100 - user.matchSummary.winRate}%` }}></div>
              </div>
            </div>
          </Card>

          <Card className="border-none shadow-sm rounded-3xl bg-surface overflow-hidden">
            <div className="p-6 border-b border-border bg-background/30">
              <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">Recent Matches</h3>
            </div>
            <div className="divide-y divide-border">
              {matchHistory.map((match) => (
                <div key={match.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-bold text-text-muted">{match.date}</span>
                    {match.result === 'WIN' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-black tracking-widest">
                        <Trophy className="w-3.5 h-3.5 mr-1.5" /> WIN
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black tracking-widest">
                        LOSE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-6">
                    <div className="text-center flex-1">
                      <p className="font-bold text-text text-lg">{match.teamA}</p>
                    </div>
                    <div className="bg-background px-5 py-2.5 rounded-2xl text-2xl font-black tracking-widest border border-border shadow-sm">
                      {match.scoreA} - {match.scoreB}
                    </div>
                    <div className="text-center flex-1">
                      <p className="font-bold text-text text-lg">{match.teamB}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Feedback & Reports Section */}
      <Card className="border-none shadow-sm rounded-3xl bg-surface overflow-hidden mt-6">
        <div className="p-6 border-b border-border bg-background/30 flex justify-between items-center">
          <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">Player Feedback & Reports</h3>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider">
            1 Active Report
          </span>
        </div>
        <div className="divide-y divide-border">
          {/* Report Item */}
          <div className="p-6 bg-red-50/30 hover:bg-red-50/50 transition-colors flex gap-5">
            <div className="mt-1">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 border border-red-200">
                <Flag className="w-5 h-5" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <h4 className="font-bold text-text text-base flex items-center gap-3">
                    Reported for: Inappropriate Language
                    <span className="px-2.5 py-1 rounded-md bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider">Pending Review</span>
                  </h4>
                  <p className="text-xs text-text-muted font-medium mt-1">Reported by Anonymous • 1w ago</p>
                </div>
              </div>
              <p className="text-sm text-text mt-3 font-medium bg-red-50/50 p-4 rounded-xl border border-red-100">
                "Swearing constantly during the match when losing."
              </p>
            </div>
          </div>

          {/* Feedback Item */}
          <div className="p-6 hover:bg-slate-50 transition-colors flex gap-5">
            <div className="mt-1">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 border border-amber-200">
                <Star className="w-5 h-5 fill-current" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1.5">
                <div>
                  <h4 className="font-bold text-text text-base">Positive Feedback</h4>
                  <p className="text-xs text-text-muted font-medium mt-1">From JohnDoe • 2d ago</p>
                </div>
              </div>
              <p className="text-sm text-text mt-3 font-medium bg-background/50 p-4 rounded-xl border border-border">
                "Great team player, always passes the ball!"
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
