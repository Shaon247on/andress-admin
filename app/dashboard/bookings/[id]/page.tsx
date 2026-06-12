"use client";

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/elements/card';
import { 
  ArrowLeft, CalendarDays, Clock, MapPin, CheckCircle2, 
  Trophy, AlertTriangle, UserPlus
} from 'lucide-react';

export default function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Mock data based on screenshots
  const gameDetails = {
    name: 'Arena FC',
    type: 'Competitive',
    visibility: 'Public',
    format: '5v5',
    price: '$35',
    date: 'Sat 8',
    time: '16:00',
    court: 'Court D',
    paymentStatus: 'Payment Completed',
    score: { teamA: 3, teamB: 2 },
  };

  const teamA = [
    { id: 1, name: 'Marcus Wright', role: 'ATT', rating: '82 OVR', isCaptain: true, payment: 'Paid' },
    { id: 2, name: 'Jordan Torres', role: 'MID', rating: '79 OVR', isCaptain: false, payment: 'Paid' },
    { id: 3, name: 'Nikos Kosta', role: 'GK', rating: '74 OVR', isCaptain: false, payment: 'Paid' },
  ];

  const teamB = [
    { id: 4, name: 'Alex Petrou', role: 'DEF', rating: '68 OVR', isCaptain: false, payment: 'Unpaid' },
    { id: 5, name: 'Chris Makrides', role: 'DEF', rating: '71 OVR', isCaptain: false, payment: 'Unpaid' },
  ];

  return (
    <div className="space-y-6 pb-10 max-w-5xl mx-auto">
      <Link href="/dashboard/bookings" className="inline-flex items-center text-sm font-bold text-text-muted hover:text-text transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Bookings
      </Link>

      {/* Main Game Info Card */}
      <Card className="bg-gradient-to-br from-[#10b981] to-[#059669] text-white p-8 rounded-[2rem] shadow-lg border-none relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap gap-3 mb-6">
          <span className="inline-flex items-center px-4 py-2 rounded-2xl bg-white/20 text-white text-xs font-black tracking-widest backdrop-blur-md shadow-sm border border-white/10">
            <Trophy className="w-4 h-4 mr-1.5" /> {gameDetails.type}
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-2xl bg-white/20 text-white text-xs font-black tracking-widest backdrop-blur-md shadow-sm border border-white/10">
            {gameDetails.visibility}
          </span>
          <span className="inline-flex items-center px-4 py-2 rounded-2xl bg-white/20 text-white text-xs font-black tracking-widest backdrop-blur-md shadow-sm border border-white/10">
            {gameDetails.format}
          </span>
          <span className="inline-flex items-center px-5 py-2 rounded-2xl bg-white text-[#059669] text-sm font-black ml-auto sm:ml-0 shadow-lg border border-white/20">
            Price {gameDetails.price}
          </span>
        </div>

        <div className="relative z-10">
          <h1 className="text-5xl font-black mb-6 tracking-tight drop-shadow-sm">{gameDetails.name}</h1>

          <div className="flex flex-wrap items-center gap-6 text-base font-bold opacity-90 mb-8 bg-black/10 w-fit px-6 py-3 rounded-2xl backdrop-blur-sm border border-white/10">
            <div className="flex items-center gap-2"><CalendarDays className="w-5 h-5" /> {gameDetails.date}</div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
            <div className="flex items-center gap-2"><Clock className="w-5 h-5" /> {gameDetails.time}</div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
            <div className="flex items-center gap-2"><MapPin className="w-5 h-5" /> {gameDetails.court}</div>
          </div>

          <div className="inline-flex items-center px-5 py-2.5 rounded-2xl bg-white/20 text-white text-sm font-black tracking-wide backdrop-blur-md border border-white/20 shadow-sm">
            <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-100" /> {gameDetails.paymentStatus}
          </div>
        </div>
      </Card>

      {/* Score Card */}
      <Card className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-white rounded-3xl shadow-lg border-none p-6 flex items-center justify-between px-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="text-xl font-black tracking-[0.2em] text-blue-200 relative z-10">TEAM A</div>
        <div className="bg-white/10 px-10 py-3 rounded-2xl text-5xl font-black tracking-widest shadow-inner border border-white/10 relative z-10 backdrop-blur-sm">
          {gameDetails.score.teamA} - {gameDetails.score.teamB}
        </div>
        <div className="text-xl font-black tracking-[0.2em] text-blue-200 relative z-10">TEAM B</div>
      </Card>

      {/* Teams Lineup */}
      <div className="grid md:grid-cols-2 gap-8 mt-4">
        {/* Team A */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pl-2 mb-2">
            <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">Team A (3/5)</h3>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2.5 py-1 rounded-full">3 Paid</span>
          </div>
          {teamA.map((player) => (
            <Card key={player.id} className="p-4 bg-surface rounded-2xl shadow-sm border border-border/50 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 border-2 border-white shadow-sm flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-bold text-text text-base">{player.name}</span>
                  {player.isCaptain && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                      👑 Captain
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 uppercase tracking-wider">{player.role}</span>
                  <span className="text-amber-500 flex items-center bg-amber-50 px-2 py-1 rounded-md"><span className="text-[10px] mr-1">★</span> {player.rating}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Paid
                </span>
              </div>
            </Card>
          ))}
          {/* Empty Slots */}
          {[1, 2].map(slot => (
            <Card key={`empty-a-${slot}`} className="p-4 bg-background/50 rounded-2xl border-2 border-dashed border-border/60 flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted/50 flex-shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-text-muted text-sm">Slot {3 + slot}</div>
                <div className="text-[11px] font-black uppercase tracking-widest text-text-muted/50 mt-1">Open Slot</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Team B */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pl-2 mb-2">
            <h3 className="text-sm font-black text-text-muted uppercase tracking-widest">Team B (2/5)</h3>
            <span className="text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">2 Unpaid</span>
          </div>
          {teamB.map((player) => (
            <Card key={player.id} className="p-4 bg-surface rounded-2xl shadow-sm border border-border/50 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-white shadow-sm flex-shrink-0" />
              <div className="flex-1">
                <div className="font-bold text-text text-base mb-1.5">{player.name}</div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 uppercase tracking-wider">{player.role}</span>
                  <span className="text-amber-500 flex items-center bg-amber-50 px-2 py-1 rounded-md"><span className="text-[10px] mr-1">★</span> {player.rating}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-red-500 bg-red-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Unpaid
                </span>
              </div>
            </Card>
          ))}
          {/* Empty Slots */}
          {[1, 2, 3].map(slot => (
            <Card key={`empty-b-${slot}`} className="p-4 bg-background/50 rounded-2xl border-2 border-dashed border-border/60 flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted/50 flex-shrink-0">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-text-muted text-sm">Slot {2 + slot}</div>
                <div className="text-[11px] font-black uppercase tracking-widest text-text-muted/50 mt-1">Open Slot</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
